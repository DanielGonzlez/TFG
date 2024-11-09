import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type{ HasOne } from '@adonisjs/lucid/types/relations'

import User from './user_model.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare clientId: string

  @column()
  declare userId: string

  @column()
  declare fullName: string

  @column()
  declare billingAddress: string

  @column()
  declare email: string

  @column()
  declare isWholesaler: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con User
  @hasOne(() => User, { foreignKey: 'userId' })
  declare user: HasOne<typeof User>

  // Getter y Setter para clientId
  get getClientId(): string {
    return this.clientId;
  }

  // Getter y Setter para fullName
  get getFullName(): string {
    return this.fullName;
  }
  set setFullName(value: string) {
    this.fullName = value;
  }

  // Getter y Setter para billingAddress
  get getBillingAddress(): string {
    return this.billingAddress;
  }
  set setBillingAddress(value: string) {
    this.billingAddress = value;
  }

  // Getter y Setter para email
  get getEmail(): string {
    return this.email;
  }
  set setEmail(value: string) {
    this.email = value;
  }

  // Getter y Setter para isWholesaler
  get getIsWholesaler(): boolean {
    return this.isWholesaler;
  }
  set setIsWholesaler(value: boolean) {
    this.isWholesaler = value;
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
  addProductToCart(): void {
    console.log(`Producto agregado al carrito por el cliente ${this.fullName}`)
  }

  removeProductToCart(): void {
    console.log(`Producto removido del carrito por el cliente ${this.fullName}`)
  }

  createInvoice(): void {
    console.log(`Factura creada para el cliente ${this.fullName}`)
  }

  updateProfile(): void {
    console.log(`Perfil actualizado para el cliente ${this.fullName}`)
  }
}
