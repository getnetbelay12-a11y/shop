const baseUrl = "http://127.0.0.1:3000";

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  addFromHeaders(headers) {
    const setCookie = headers.getSetCookie ? headers.getSetCookie() : [];
    for (const value of setCookie) {
      const [pair] = value.split(";");
      const index = pair.indexOf("=");
      if (index === -1) continue;
      const key = pair.slice(0, index).trim();
      const cookieValue = pair.slice(index + 1).trim();
      this.cookies.set(key, cookieValue);
    }
  }

  header() {
    return Array.from(this.cookies.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
  }
}

async function request(path, options = {}, jar) {
  const headers = new Headers(options.headers || {});
  if (jar?.header()) headers.set("cookie", jar.header());
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    redirect: "manual"
  });
  jar?.addFromHeaders(response.headers);
  return response;
}

async function signIn(phoneNumber) {
  const jar = new CookieJar();
  const otpResponse = await request("/api/auth/request-otp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ phoneNumber, purpose: "seller_login" })
  }, jar);
  const otpData = await otpResponse.json();
  const csrfResponse = await request("/api/auth/csrf", {}, jar);
  const csrfData = await csrfResponse.json();
  const body = new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    phoneNumber,
    otpCode: otpData.devCode || "123456",
    callbackUrl: `${baseUrl}/dashboard`,
    json: "true"
  });
  const loginResponse = await request(
    "/api/auth/callback/credentials",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body
    },
    jar
  );
  const text = await loginResponse.text();
  if (![200, 302].includes(loginResponse.status)) {
    throw new Error(`Login failed for ${phoneNumber}: ${loginResponse.status} ${text}`);
  }
  return jar;
}

async function expectIncludes(path, expected, jar) {
  const response = await request(path, {}, jar);
  const text = await response.text();
  if (!response.ok || !text.includes(expected)) {
    throw new Error(`Expected ${path} to include "${expected}"`);
  }
}

async function main() {
  await expectIncludes("/", "Turn social traffic into real ETB orders", null);
  await expectIncludes("/shop/demo-style", "Selam Style Studio", null);
  await expectIncludes("/shop/demo-style?q=sneakers", "Addis Everyday White Sneakers", null);
  await expectIncludes("/shop/demo-style/product", "not-used", null).catch(() => {});

  const sellerJar = await signIn("+251911223344");
  await expectIncludes("/dashboard", "Overview", sellerJar);
  await expectIncludes("/dashboard/products", "Create and manage your catalog", sellerJar);

  const productPayload = {
    title: "QA Runner Jacket",
    description: "Technical lightweight jacket for evening city wear and creator shoots.",
    price: 3600,
    category: "Outerwear",
    stock: 6,
    tags: ["jacket", "lightweight", "city"],
    images: [],
    attributes: { color: "graphite", size: "M" }
  };

  const productResponse = await request(
    "/api/products",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(productPayload)
    },
    sellerJar
  );
  const productData = await productResponse.json();
  if (!productResponse.ok || !productData.product?._id) {
    throw new Error(`Product creation failed: ${JSON.stringify(productData)}`);
  }

  const createdId = String(productData.product._id);
  await expectIncludes("/shop/demo-style?q=runner", "QA Runner Jacket", null);
  await expectIncludes(`/shop/demo-style/product/${createdId}`, "QA Runner Jacket", null);

  const chatResponse = await request(
    "/api/stores/demo-style/chat",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Do you have cheaper shoes?" })
    },
    null
  );
  const chatData = await chatResponse.json();
  if (!chatResponse.ok || !chatData.answer || !/ETB|catalog|matches|አማራጮች/i.test(chatData.answer)) {
    throw new Error(`AI chat failed: ${JSON.stringify(chatData)}`);
  }

  const similarPage = await request(`/shop/demo-style/product/${createdId}`, {}, null);
  const similarHtml = await similarPage.text();
  if (!similarHtml.includes("Similar items")) {
    throw new Error("Similar items section missing");
  }

  const orderResponse = await request(
    "/api/orders",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: createdId,
        storeSlug: "demo-style",
        name: "QA Buyer",
        phone: "+251911000999",
        telegram: "@qa_buyer",
        city: "Addis Ababa",
        address: "Bole Road",
        quantity: 1
      })
    },
    null
  );
  const orderData = await orderResponse.json();
  if (!orderResponse.ok || !orderData.order?._id) {
    throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);
  }

  await expectIncludes("/dashboard/orders", "QA Buyer", sellerJar);

  const adminJar = await signIn("+251911000111");
  await expectIncludes("/admin", "Admin panel", adminJar);
  await expectIncludes("/admin", "Selam Style Studio", adminJar);

  console.log(JSON.stringify({
    ok: true,
    createdProductId: createdId,
    chatAnswer: chatData.answer
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
