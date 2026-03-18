import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export const sellerSetupSchema = z.object({
  storeName: z.string().trim().min(2, "Store name must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters."),
  phone: z.string().trim().min(7, "Phone number looks too short."),
  logo: z.string().trim().url("Logo must be a valid URL.").optional().or(z.literal("")),
  banner: z.string().trim().url("Banner must be a valid URL.").optional().or(z.literal("")),
  language: z.enum(["EN", "AM"])
});

export const productSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  category: z.string().trim().min(2, "Category is required."),
  stock: z.coerce.number().min(0, "Stock cannot be negative."),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url("Each image must be a valid URL.")).default([]),
  attributes: z.record(z.string(), z.string()).default({})
});

export const orderSchema = z.object({
  productId: z.string().min(1),
  storeSlug: z.string().min(1),
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z.string().trim().min(7, "Phone number looks too short."),
  telegram: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required."),
  address: z.string().trim().min(5, "Address must be at least 5 characters."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1.")
});
