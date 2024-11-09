import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Client from './client_model.js'
import OrganizationAddress from './organizationAdress_model.js'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare organizationId: string

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

  // Getter y Setter para organizationId
  get getOrganizationId(): string {
    return this.organizationId;
  }

  // Getter y Setter para name
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }

  // Getter y Setter para fiscalId
  get getFiscalId(): string {
    return this.fiscalId;
  }
  set setFiscalId(value: string) {
    this.fiscalId = value;
  }

  // Getter y Setter para logo
  get getLogo(): string {
    return this.logo;
  }
  set setLogo(value: string) {
    this.logo = value;
  }

  // Getter y Setter para createdAt
  get getCreatedAt(): DateTime {
    return this.createdAt;
  }
  set setCreatedAt(value: DateTime) {
    this.createdAt = value;
  }

  // Getter y Setter para updatedAt
  get getUpdatedAt(): DateTime | null {
    return this.updatedAt;
  }
  set setUpdatedAt(value: DateTime | null) {
    this.updatedAt = value;
  }

  // Métodos de la clase
  registerOrganization(): void {
    console.log(`Organización registrada: ${this.name}`);
    this.createdAt = DateTime.local();
    this.updatedAt = DateTime.local();
  }

  updateOrganization(): void {
    console.log(`Organización actualizada: ${this.name}`);
    this.updatedAt = DateTime.local();
  }
}
