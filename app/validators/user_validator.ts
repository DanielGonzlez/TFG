import vine from '@vinejs/vine';

export const createUserSchema = vine.object({
	name: vine.string().trim(),
	first_name: vine.string().trim(),
	last_name: vine.string().trim().optional(),
	email: vine.string().normalizeEmail({
		all_lowercase: true,
		gmail_remove_dots: true,
	}),
	password: vine.string(),
}).toCamelCase();

export const createUserValidator = vine.compile(createUserSchema);

export const updateUserValidator = vine.compile(
	vine.object({
		email: vine.string().email()
	}).toCamelCase()
);

export const loginUserValidator = vine.compile(
	vine.object({
		email: vine.string().trim(),
		password: vine.string(),
	}).toCamelCase()
);

export const statisticsUserValidator = vine.object({
	from: vine.date({
		formats: ['D/M/YYYY']
	}),
	to: vine.date({
		formats: ['D/M/YYYY']
	})

}).toCamelCase();