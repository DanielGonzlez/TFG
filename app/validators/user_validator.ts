import vine from '@vinejs/vine'

// Esquema de validación de registro
export const RegisterSchema = vine.object({
  name: vine.string().trim().minLength(3).maxLength(50),
  firstName: vine.string().trim().minLength(3).maxLength(50),
  lastName: vine.string().trim().minLength(3).maxLength(50).optional(),
  email: vine.string()
    .email()  // Validación básica de formato de email
    .normalizeEmail({
      all_lowercase: true,
      gmail_remove_dots: true,
    }),
  password: vine.string().minLength(6).maxLength(20),
  billingAddress: vine.string().minLength(10).maxLength(200),
  isWholesaler: vine.boolean().optional(),
  organizationId: vine.string().optional()
}).toCamelCase()

// Compilación del validador para su uso
export const RegisterValidator = vine.compile(RegisterSchema)
