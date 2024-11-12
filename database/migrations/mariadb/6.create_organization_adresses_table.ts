import { BaseSchema } from '@adonisjs/lucid/schema'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.ORGANIZATION_ADDRESS
  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('address_id').primary().defaultTo(this.db.raw('UUID()'));
      table.string('organization_id').notNullable()
        .references('organization_id')
        .inTable(MIGRATIONS_TABLE_NAME.ORGANIZATION)
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        
      table.string('country').nullable()
      table.string('address').nullable()
      table.string('province').nullable()
      table.string('town').nullable()
      table.string('postal_code').nullable()
      table.string('type').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
