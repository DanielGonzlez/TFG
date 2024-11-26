import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Administrator from './administrator_model.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare productId: string 

  @beforeSave()
  public static async generateUuid(product: Product) {
    if (!product.productId) {
      product.productId = uuidv4();  // Generar UUID antes de guardar
    }
  }


  @column()
  declare adminId: string

  @column()
  declare name: string

  @column()
  declare author: string

  @column()
  declare description: string

  @column()
  declare unit: number

  @column()
  declare price: number

  @column()
  declare discount: number

  @column()
  declare category: string

  @column()
  declare image: string

  @column()
  declare discountType: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  //? Relación con Administrator (un producto puede ser creado por un solo administrador)
  @belongsTo(() => Administrator, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof Administrator>

}
