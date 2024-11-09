import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import { USER_STATUS } from '#types/user_type'
import { USER_ROL } from '#types/user_type'
import type { HasOne } from '@adonisjs/lucid/types/relations'

import Administrator from './administrator_model.js'
import Client from './client_model.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare userId: string

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

  // Getter para userId
  get getUserId(): string {
    return this.userId;
  }

  // Getter y Setter para name
  get getName(): string | null {
    return this.name;
  }
  set setName(value: string | null) {
    this.name = value;
  }

  // Getter y Setter para firstName
  get getFirstName(): string | null {
    return this.firstName;
  }
  set setFirstName(value: string | null) {
    this.firstName = value;
  }

  // Getter y Setter para lastName
  get getLastName(): string | null {
    return this.lastName;
  }
  set setLastName(value: string | null) {
    this.lastName = value;
  }

  // Getter y Setter para email
  get getEmail(): string {
    return this.email;
  }
  set setEmail(value: string) {
    this.email = value;
  }

  // Getter y Setter para password
  get getPassword(): string {
    return this.password;
  }
  set setPassword(value: string) {
    this.password = value;
  }

  // Getter y Setter para status
  get getStatus(): USER_STATUS {
    return this.status;
  }
  set setStatus(value: USER_STATUS) {
    this.status = value;
  }

  // Getter y Setter para rol
  get getRol(): USER_ROL {
    return this.rol;
  }
  set setRol(value: USER_ROL) {
    this.rol = value;
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