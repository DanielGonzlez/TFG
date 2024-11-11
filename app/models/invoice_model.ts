import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import InvoiceProduct from './invoiceProduct_model.js'
import Client from './client_model.js'

import { DISCOUNT_TYPE } from '#types/invoice_type'
import { STATUS } from '#types/invoice_type'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare invoiceId: string

  @column()
  declare organizationId: string

  @column()
  declare clientId: string

  @column()
  declare currentId: string

  @column()
  declare clientName: string

  @column()
  declare currency: string

  @column()
  declare discount: number

  @column()
  declare discountType: DISCOUNT_TYPE

  @column()
  declare oneOffProducts: string

  @column()
  declare taxPercent: number

  @column()
  declare taxName: string

  @column()
  declare status: STATUS

  @column.dateTime({ autoCreate: true })
  declare nextRecurringAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con InvoiceProduct (una factura puede tener muchos productos)
  @hasMany(() => InvoiceProduct, { foreignKey: 'invoiceId' })
  declare invoiceProducts: HasMany<typeof InvoiceProduct>

  @belongsTo(() => Client, { foreignKey: 'clientId' })
  declare client: BelongsTo<typeof Client>

  // Métodos de la clase
  generateInvoice(): void {
    console.log(`Factura generada: ${this.invoiceId}`)
    this.createdAt = DateTime.local()
    this.updatedAt = DateTime.local()
  }

  applyDiscount(): void {
    if (this.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      console.log(`Aplicando descuento del ${this.discount}% a la factura ${this.invoiceId}`)
    } else {
      console.log(`Aplicando descuento fijo de ${this.discount} a la factura ${this.invoiceId}`)
    }
  }

  markAsPaid(): void {
    console.log(`Factura ${this.invoiceId} marcada como PAGADA`)
    this.status = STATUS.PAID
    this.updatedAt = DateTime.local()
  }

  cancelInvoice(): void {
    console.log(`Factura ${this.invoiceId} cancelada`)
    this.status = STATUS.CANCELLED
    this.updatedAt = DateTime.local()
  }
}
