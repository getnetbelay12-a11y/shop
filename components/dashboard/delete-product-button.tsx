"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  async function remove() {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE"
    });
    if (response.ok) {
      router.refresh();
    }
  }

  return <Button variant="outline" onClick={remove}>Delete</Button>;
}
