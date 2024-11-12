import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany ,beforeSave} from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid';

import type{ BelongsTo } from '@adonisjs/lucid/types/relations'
import type{ HasMany } from '@adonisjs/lucid/types/relations'

import User from './user_model.js'
import Organization from './organization_model.js'
import Invoice from './invoice_model.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare clientId: string

  @beforeSave()
  public static async generateUuid(cli: Client) {
    if (!cli.clientId) {
      cli.clientId = uuidv4();  // Generar UUID antes de guardar
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

  @column()
  declare isWholesaler: boolean

  @column()
  declare organizationId: string | null  // Clave foránea a Organization (puede ser null si no pertenece a ninguna)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación con User
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  // Relación con Organization (un cliente puede pertenecer a una organización)
  @belongsTo(() => Organization, { foreignKey: 'organizationId' })
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Invoice, { foreignKey: 'clientId' })
  declare invoices: HasMany<typeof Invoice>
}
