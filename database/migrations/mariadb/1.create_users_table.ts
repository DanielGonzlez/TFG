import { BaseSchema } from '@adonisjs/lucid/schema'
import { USER_ROL } from '#types/user_type'
import { USER_STATUS } from '#types/user_type'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.USER

  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_id').primary()
      table.string('name').nullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.enu('status', [USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED]).defaultTo(USER_STATUS.ACTIVE)
      table.enu('rol', [USER_ROL.CLIENT, USER_ROL.ADMIN]).defaultTo(USER_ROL.ADMIN)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}