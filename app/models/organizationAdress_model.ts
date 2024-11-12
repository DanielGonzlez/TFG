import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Organization from './organization_model.js'

export default class OrganizationAddress extends BaseModel {
  @column({ isPrimary: true })
  declare addressId: string  // Clave primaria única para cada dirección

  @beforeSave()
  public static async generateUuid(orgAdd: OrganizationAddress) {
    if (!orgAdd.addressId) {
      orgAdd.addressId = uuidv4();  // Generar UUID antes de guardar
    }
  }

  @column()
  declare organizationId: string  // Clave foránea que hace referencia a la organización

  @column()
  declare country: string

  @column()
  declare address: string

  @column()
  declare province: string

  @column()
  declare town: string

  @column()
  declare postalCode: string

  @column()
  declare type: string  // Tipo de dirección (por ejemplo: "oficina", "facturación", etc.)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con Organization (una dirección pertenece a una sola organización)
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>
}
