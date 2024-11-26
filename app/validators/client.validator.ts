import vine from '@vinejs/vine';

export const createClientSchema = vine.object({
	full_name: vine.string().trim(),
	billing_address: vine.string().trim(),
	email: vine.string().normalizeEmail({
		all_lowercase: true,
		gmail_remove_dots: true,
	}),
}).toCamelCase();

export const createClientValidator = vine.compile(createClientSchema);

export const destroyClientValidator = vine.compile(
	vine.object({
		params: vine.object({
			client_id: vine.string().uuid()
		}),
	}).toCamelCase()
);

export const paramClientIdValidatorSchema = vine.object({
	params: vine.object({
		client_id: vine.string().uuid()
	})
}).toCamelCase();

export const paramClientIdValidatorValidator = vine.compile(paramClientIdValidatorSchema);