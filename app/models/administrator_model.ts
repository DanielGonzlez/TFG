import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type{ HasOne } from '@adonisjs/lucid/types/relations'
import type{ HasMany } from '@adonisjs/lucid/types/relations'

import User from './user_model.js'
import Product from './product_model.js'

export default class Administrator extends BaseModel {
    @column({ isPrimary: true })
    declare adminId: string

    @beforeSave()
    public static async generateUuid(adm: Administrator) {
      if (!adm.userId) {
        adm.userId = uuidv4();
      }
    }
  
    @column()
    declare userId: string
  
    @column()
    declare fullName: string
  
    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
  
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null
  
    //* Relación con User
    @hasOne(() => User, { foreignKey: 'userId' })
    declare user: HasOne<typeof User>

    //* Relación con Product (un administrador puede crear muchos productos)
    @hasMany(() => Product, { foreignKey: 'adminId' })
    declare products: HasMany<typeof Product>
  }