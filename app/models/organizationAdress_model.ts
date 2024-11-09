import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Organization from './organization_model.js'

export default class OrganizationAddress extends BaseModel {
  @column({ isPrimary: true })
  declare addressId: string  // Clave primaria única para cada dirección

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

  // Getter y Setter para addressId
  get getAddressId(): string {
    return this.addressId
  }

  // Getter y Setter para country
  get getCountry(): string {
    return this.country
  }
  set setCountry(value: string) {
    this.country = value
  }

  // Getter y Setter para address
  get getAddress(): string {
    return this.address
  }
  set setAddress(value: string) {
    this.address = value
  }

  // Getter y Setter para province
  get getProvince(): string {
    return this.province
  }
  set setProvince(value: string) {
    this.province = value
  }

  // Getter y Setter para town
  get getTown(): string {
    return this.town
  }
  set setTown(value: string) {
    this.town = value
  }

  // Getter y Setter para postalCode
  get getPostalCode(): string {
    return this.postalCode
  }
  set setPostalCode(value: string) {
    this.postalCode = value
  }

  // Getter y Setter para type
  get getType(): string {
    return this.type
  }
  set setType(value: string) {
    this.type = value
  }

  // Getter y Setter para createdAt
  get getCreatedAt(): DateTime {
    return this.createdAt
  }
  set setCreatedAt(value: DateTime) {
    this.createdAt = value
  }

  // Getter y Setter para updatedAt
  get getUpdatedAt(): DateTime | null {
    return this.updatedAt
  }
  set setUpdatedAt(value: DateTime | null) {
    this.updatedAt = value
  }

  // Método para actualizar la dirección
  updateAddress(): void {
    console.log(`Dirección actualizada para la organización con ID ${this.organizationId}`)
    this.updatedAt = DateTime.local()
  }
}
