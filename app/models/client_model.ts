import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany ,beforeSave} from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type{ BelongsTo } from '@adonisjs/lucid/types/relations'
import type{ HasMany } from '@adonisjs/lucid/types/relations'

import User from './user_model.js'
import Invoice from './invoice_model.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare clientId: string

  @beforeSave()
  public static async generateUuid(cli: Client) {
    if (!cli.clientId) {
      cli.clientId = uuidv4();
    }
  }

  @column()
  declare userId: string

  @column()
  declare fullName: string

  @column()
  declare billingAddress: string

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con User
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Invoice, { foreignKey: 'clientId' })
  declare invoices: HasMany<typeof Invoice>
}
