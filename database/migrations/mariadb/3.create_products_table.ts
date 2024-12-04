import { BaseSchema } from '@adonisjs/lucid/schema'

import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';
import { DISCOUNT_TYPE } from '#types/product_type';
import { CATEGORY_TYPE } from '#types/product_type';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.PRODUCT
  protected connection = 'mariadb'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('product_id').primary().defaultTo(this.db.raw('UUID()'));
      table.string('admin_id').notNullable()
        .references('admin_id')
        .inTable(MIGRATIONS_TABLE_NAME.ADMINISTRATOR)
        .onUpdate('CASCADE')
        
      table.string('name').notNullable()
      table.string('author').notNullable()
      table.text('description').notNullable()
      table.string('unit').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('discount').nullable()
      table.enu('discount_type', [DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]).notNullable()
      table.string('image').nullable()
      table.enu('category', [CATEGORY_TYPE.AVENTURA, CATEGORY_TYPE.DRAMA, 
        CATEGORY_TYPE.CIEN_FICCION, CATEGORY_TYPE.FANTASIA]).notNullable()

      

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
