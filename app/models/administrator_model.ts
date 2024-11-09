import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type{ HasOne } from '@adonisjs/lucid/types/relations'

import User from './user_model.js'

export default class Administrator extends BaseModel {
    @column({ isPrimary: true })
    declare adminId: string
  
    @column()
    declare userId: string
  
    @column()
    declare fullName: string
  
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
  
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null
  
    // Relación con User
    @hasOne(() => User, { foreignKey: 'userId' })
    declare user: HasOne<typeof User>
  
    // Métodos de negocio
    public createProduct(): void {
      console.log('Producto creado');
    }
  
    public updateProduct(): void {
      console.log('Producto actualizado');
    }
  
    public deleteProduct(): void {
      console.log('Producto eliminado');
    }
  
    // Getter y Setter para adminId
    get getAdminId(): string {
      return this.adminId;
    }
  
    // Getter y Setter para fullName
    get getFullName(): string {
      return this.fullName;
    }
    set setFullName(value: string) {
      this.fullName = value;
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
  }