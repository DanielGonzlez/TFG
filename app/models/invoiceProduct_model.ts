import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Invoice from './invoice_model.js'
import Product from './product_model.js'

export default class InvoiceProduct extends BaseModel {
  public static connection = 'postgresql'
  @column({ isPrimary: true })
  declare invoiceProductId: string

  @beforeSave()
  public static async generateUuid(invPro: InvoiceProduct) {
    if (!invPro.invoiceProductId) {
      invPro.invoiceProductId = uuidv4();  // Generar UUID antes de guardar
    }
  }

  @column()
  declare invoiceId: string

  @column()
  declare productId: string

  @column()
  declare productName: string

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con Invoice (un producto de factura pertenece a una sola factura)
  @belongsTo(() => Invoice, { foreignKey: 'invoiceId' })
  declare invoice: BelongsTo<typeof Invoice>

  // Relación con Product (un producto de factura pertenece a un solo producto)
  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>
}