import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import InvoiceProduct from './invoiceProduct_model.js'
import Client from './client_model.js'

import { STATUS } from '#types/invoice_type'

export default class Invoice extends BaseModel {
  public static connection = 'postgresql'
  @column({ isPrimary: true })
  declare invoiceId: string

  @beforeSave()
  public static async generateUuid(inv: Invoice) {
    if (!inv.invoiceId) {
      inv.invoiceId = uuidv4();  // Generar UUID antes de guardar
    }
  }

  @column()
  declare organizationId: string

  @column()
  declare clientId: string

  @column()
  declare clientName: string

  @column()
  declare currency: string

  @column()
  declare discount: number

  @column()
  declare taxPercent: number

  @column()
  declare taxName: string

  @column()
  declare status: STATUS

  @column()
  declare subtotal: number

  @column()
  declare taxTotal: number

  @column()
  declare total: number

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
}
