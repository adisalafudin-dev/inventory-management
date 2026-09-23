import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email Tidak Valid"),
  password: z.string().min(6, "Password Minimal 6 Character"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const RegisterSchema = z.object({
  username: z
    .string({ error: "Harus Diisi" })
    .min(3, "Username Minimal 3 Character"),
  email: z.email("Email Tidak Valid"),
  password: z.string().min(6, "Password Minimal 6 Character"),
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;
