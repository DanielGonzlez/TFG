import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type { HasMany } from '@adonisjs/lucid/types/relations'

import Client from './client_model.js'
import OrganizationAddress from './organizationAdress_model.js'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare organizationId: string

  @beforeSave()
  public static async generateUuid(org: Organization) {
    if (!org.organizationId) {
      org.organizationId = uuidv4();  //* Generar UUID antes de guardar
    }
  }

  @column()
  declare name: string

  @column()
  declare fiscalId: string

  @column()
  declare logo: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con Client (una organización puede tener muchos clientes)
  @hasMany(() => Client, { foreignKey: 'organizationId' })
  declare clients: HasMany<typeof Client>

  // Relación con OrganizationAddress (una organización tiene muchas direcciones)
  @hasMany(() => OrganizationAddress, { foreignKey: 'organizationId' })
  declare addresses: HasMany<typeof OrganizationAddress>
}
