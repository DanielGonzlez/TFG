//! validators/product.validator.ts

import vine from '@vinejs/vine'
import { DISCOUNT_TYPE, CATEGORY_TYPE } from '#types/product_type';

export const createProductSchema = vine.object({
  name: vine.string().trim().maxLength(150),
  author: vine.string().trim().minLength(10).maxLength(50),
  description: vine.string().trim().minLength(10).maxLength(2500),
  category: vine.enum(CATEGORY_TYPE),
  price: vine.number().range([0, 10000]),
  discount: vine.number().range([0, 250]).optional(),
  discountType: vine.enum(DISCOUNT_TYPE),
  unit: vine.number().range([0, 1000000]),
  available: vine.boolean().optional(), //* Para asegurar un valor booleano
  image: vine.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg'] }).optional(),
}).toCamelCase();


export const createProductValidator = vine.compile(createProductSchema);
