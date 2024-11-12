import { BaseSchema } from '@adonisjs/lucid/schema'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.ADMINISTRATOR
  
  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('admin_id').primary().defaultTo(this.db.raw('UUID()'));
      table.string('user_id').notNullable()
        .references('user_id')
        .inTable(MIGRATIONS_TABLE_NAME.USER)
        .onUpdate('CASCADE')
        
      table.string('full_name').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}