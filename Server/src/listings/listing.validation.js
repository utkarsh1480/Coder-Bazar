import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional(),

  price: z
    .coerce
    .number()
    .positive("Price must be greater than 0"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City is too long"),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),
});

export const updateListingSchema = z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(5000, "Description is too long")
      .optional(),

    price: z
      .coerce
      .number()
      .positive("Price must be greater than 0")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100, "City is too long")
      .optional(),

    categoryId: z
      .string()
      .uuid("Invalid category ID")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );

export const filterListingSchema = z
  .object({
    search: z.string().trim().optional(),

    categoryId: z
      .string()
      .uuid("Invalid category ID")
      .optional(),

    city: z
      .string()
      .trim()
      .optional(),

    minPrice: z
      .coerce
      .number()
      .nonnegative()
      .optional(),

    maxPrice: z
      .coerce
      .number()
      .nonnegative()
      .optional(),

    sort: z
      .enum([
        "latest",
        "oldest",
        "price_asc",
        "price_desc",
      ])
      .default("latest"),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    }
  );
 export const paginationValidation = z.object({
page: z.coerce
  .number()
  .int()
  .min(1, "Page must be at least 1")
  .default(1),

limit: z.coerce
  .number()
  .int()
  .min(1, "Limit must be at least 1")
  .max(100, "Limit cannot exceed 100")
  .default(10),
 })