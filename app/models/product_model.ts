import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Administrator from './administrator_model.js'
import { DISCOUNT_TYPE } from '#types/product_type'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare productId: string 

  @column()
  declare adminId: string

  @column()
  declare name: string

  @column()
  declare unit: number

  @column()
  declare price: number

  @column()
  declare discount: number

  @column()
  declare discountType: DISCOUNT_TYPE

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con Administrator (un producto puede ser creado por un solo administrador)
  @belongsTo(() => Administrator, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof Administrator>

  // Getter y Setter para productId
  get getProductId(): string {
    return this.productId
  }

  // Getter y Setter para name
  get getName(): string {
    return this.name
  }
  set setName(value: string) {
    this.name = value
  }

  // Getter y Setter para unit
  get getUnit(): number {
    return this.unit
  }
  set setUnit(value: number) {
    this.unit = value
  }

  // Getter y Setter para price
  get getPrice(): number {
    return this.price
  }
  set setPrice(value: number) {
    this.price = value
  }

  // Getter y Setter para discount
  get getDiscount(): number {
    return this.discount
  }
  set setDiscount(value: number) {
    this.discount = value
  }

  // Getter y Setter para discountType
  get getDiscountType(): DISCOUNT_TYPE {
    return this.discountType
  }
  set setDiscountType(value: DISCOUNT_TYPE) {
    this.discountType = value
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

  // Método para aplicar descuento
  applyDiscount(): void {
    if (this.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      console.log(`Descuento del ${this.discount}% aplicado al producto ${this.name}`)
      this.price -= (this.price * this.discount) / 100
    } else if (this.discountType === DISCOUNT_TYPE.FIXED) {
      console.log(`Descuento fijo de ${this.discount} aplicado al producto ${this.name}`)
      this.price -= this.discount
    }
  }

  // Método para calcular el precio final
  calculatePrice(): number {
    if (this.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      return this.price - (this.price * this.discount) / 100
    } else if (this.discountType === DISCOUNT_TYPE.FIXED) {
      return this.price - this.discount
    }
    return this.price
  }

  // Método para actualizar el stock
  updateStock(newUnit: number): void {
    this.unit = newUnit
    console.log(`El stock del producto ${this.name} se ha actualizado a ${this.unit} unidades`)
  }
}
