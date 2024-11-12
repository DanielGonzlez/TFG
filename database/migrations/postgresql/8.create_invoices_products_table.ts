import { BaseSchema } from '@adonisjs/lucid/schema';
import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.INVOICES_PRODUCTS;
  protected connection = 'postgresql';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('invoice_product_id').primary() // UUID generado automáticamente
      table.uuid('invoice_id').notNullable()
        .references('invoice_id')
        .inTable(MIGRATIONS_TABLE_NAME.INVOICES)
        .onDelete('CASCADE'); // Asegúrate de que la relación se respete y se eliminen los productos cuando se elimine la factura
      table.string('product_id').notNullable();
      table.string('product_name').notNullable();
      table.integer('quantity').notNullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
