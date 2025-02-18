import { BaseSchema } from '@adonisjs/lucid/schema'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.CLIENT
  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('client_id').primary().defaultTo(this.db.raw('UUID()'));
      table.string('user_id').notNullable()
        .references('user_id')
        .inTable(MIGRATIONS_TABLE_NAME.USER)
        
      table.string('full_name').notNullable()
      table.string('billing_address').notNullable()
      table.string('email').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
