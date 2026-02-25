import { z } from "zod";

const FieldErrorSchema = z.object({
  field: z.enum([
    'email', 'username', 'password', 'confirmPassword'
  ]),
  message: z.string(),
});

export const SignUpValidationErrorSchema = z.object({
  errors: z.array(FieldErrorSchema),
});


export type SignUpValidationError = z.infer<typeof SignUpValidationErrorSchema>;
