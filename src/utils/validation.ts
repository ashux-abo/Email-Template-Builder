import { z } from "zod";

// Registration form schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must be less than 100 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Login form schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Email sending form schema
export const emailSendSchema = z.object({
  // FIX: Changed from z.string({ required_error: '...' }) to .min(1)
  templateId: z.string().min(1, "Please select a template"),

  recipients: z
    .string()
    .min(1, { message: "At least one recipient is required" })
    .refine(
      (emails) => {
        if (!emails) return false;
        const emailList = emails.split(",").map((e) => e.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailList.every((email) => emailRegex.test(email));
      },
      { message: "Please enter valid email addresses separated by commas" },
    ),

  subject: z.string().min(1, { message: "Subject is required" }),

  // This is already correct (2 arguments provided)
  variables: z
    .record(z.string(), z.string())
    .refine(
      (data) => Object.values(data).every((value) => value.trim() !== ""),
      {
        message: "All template variables must be filled out",
      },
    ),
});

// Type definitions for TypeScript
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type EmailSendFormValues = z.infer<typeof emailSendSchema>;
