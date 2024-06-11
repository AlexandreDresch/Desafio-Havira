import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  email: z
    .string()
    .email({
      message:
        "Por favor, insira um e-mail válido.",
    }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "Por favor, insira um número de telefone válido.",
    }),
  city: z
    .string()
    .min(1, { message: "A cidade não pode estar vazia." })
    .max(100, { message: "A cidade deve ter no máximo 100 caracteres." }),
  street: z
    .string()
    .min(1, { message: "A rua não pode estar vazia." })
    .max(100, { message: "A rua deve ter no máximo 100 caracteres." }),
  number: z
    .string()
    .regex(/^\d+$/, {
      message: "O número deve ser um valor positivo e inteiro.",
    }),
  zipCode: z
    .string()
    .regex(
      /^(?:\d{5}(?:-\d{4})?|[A-Z]\d[A-Z] \d[A-Z]\d)$/,
      {
        message: "Por favor, insira um código postal válido.",
      }),
});
