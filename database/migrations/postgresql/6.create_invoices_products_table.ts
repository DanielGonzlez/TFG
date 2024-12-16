import { BaseSchema } from '@adonisjs/lucid/schema';
import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';
import { DISCOUNT_TYPE } from '#types/invoice_type';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.INVOICES_PRODUCTS;
  protected connection = 'postgresql';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('invoice_product_id').primary();
      table.uuid('invoice_id').notNullable()
        .references('invoice_id')
        .inTable(MIGRATIONS_TABLE_NAME.INVOICES)
        .onDelete('CASCADE');
      table.string('product_id').notNullable();
      table.string('product_name').notNullable();
      table.integer('quantity').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.enu('discount_type', [DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]).defaultTo(DISCOUNT_TYPE.NONE);
      table.decimal('discounted_price', 10, 2).notNullable();
      table.decimal('discount', 10, 2).nullable();
      table.decimal('tax', 10, 2).notNullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
