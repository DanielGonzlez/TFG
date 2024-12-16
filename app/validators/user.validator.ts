import vine from '@vinejs/vine';

export const RegisterSchema = vine.object({
  firstName: vine.string().trim().minLength(3).maxLength(50),
  lastName: vine.string().trim().minLength(3).maxLength(50).optional(),
  email: vine.string()
    .email()
    .normalizeEmail({
      all_lowercase: true,
      gmail_remove_dots: true,
    }),
    password: vine.string()
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/`~\\-])(?!.*\s).{10,20}$/)
    .minLength(10)
    .maxLength(20),


  billingAddress: vine.string().minLength(10).maxLength(200),
}).toCamelCase();

export const RegisterValidator = vine.compile(RegisterSchema);
