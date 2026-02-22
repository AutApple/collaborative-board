import { z } from 'zod';

export const RegisterDTO = z.object({
    email: z.email({ error: 'Invalid email' }),
    username: z.string().max(20, {message: 'Username can\'t exceed 20 characters'}),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { message: "Must include a lowercase letter" })
        .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
        .regex(/[0-9]/, { message: "Must include a number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Must include a special character" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });;

export type RegisterDTOType = z.infer<typeof RegisterDTO>;
