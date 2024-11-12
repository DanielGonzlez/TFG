import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, beforeSave } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import type { HasOne } from '@adonisjs/lucid/types/relations'

import Administrator from './administrator_model.js'
import Client from './client_model.js'

import { USER_STATUS } from '#types/user_type'
import { USER_ROL } from '#types/user_type'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare userId: string

  @beforeSave()
  public static async generateUuid(user: User) {
    if (!user.userId) {
      user.userId = uuidv4();  // Generar UUID antes de guardar
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

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: USER_STATUS

  @column()
  declare rol: USER_ROL

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Client, { foreignKey: 'userId'})
  declare client: HasOne<typeof Client>;

  @hasOne(() => Administrator, { foreignKey: 'userId'})
  declare administrator: HasOne<typeof Administrator>;

}