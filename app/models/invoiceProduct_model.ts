import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Invoice from './invoice_model.js'
import Product from './product_model.js'

export default class InvoiceProduct extends BaseModel {
  @column({ isPrimary: true })
  declare invoiceProductId: string

  @column()
  declare invoiceId: string

  @column()
  declare productId: string

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

  // Métodos de la clase
  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity
    this.updatedAt = DateTime.local()
    console.log(`Cantidad actualizada a ${newQuantity} para el producto ${this.productId} en la factura ${this.invoiceId}`)
  }
}