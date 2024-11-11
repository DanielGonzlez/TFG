import { BaseSchema } from '@adonisjs/lucid/schema'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.CLIENT
  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('client_id').primary()
      table.string('user_id').notNullable()
        .references('user_id')
        .inTable(MIGRATIONS_TABLE_NAME.USER)
      table.string('organization_id').nullable()
        .references('organization_id')
        .inTable(MIGRATIONS_TABLE_NAME.ORGANIZATION)
      table.string('full_name').nullable()
      table.string('billing_address').nullable()
      table.string('email').nullable()
      table.boolean('is_wholesaler').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
