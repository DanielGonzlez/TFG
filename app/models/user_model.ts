import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasOne } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

import type { HasOne } from '@adonisjs/lucid/types/relations'
import Client from '#models/client_model'
import Administrator from '#models/administrator_model'
import { USER_STATUS, USER_ROL } from '#types/user_type'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare userId: string

  @beforeSave()
  public static async generateUuid(user: User) {
    if (!user.userId) {
      user.userId = uuidv4()
    }
  }

  @column()
  declare name: string | null

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare status: USER_STATUS

  @column()
  declare rol: USER_ROL

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Client, { foreignKey: 'userId' })
  declare client: HasOne<typeof Client>

  @hasOne(() => Administrator, { foreignKey: 'userId' })
  declare administrator: HasOne<typeof Administrator>

}
