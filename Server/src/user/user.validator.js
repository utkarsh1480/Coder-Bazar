import {z} from 'zod'
export const updateProfileSchema = z.object({
     name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .optional(),
       Avatar: z
      .string()
      .url("Avatar must be a valid URL")
      .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );