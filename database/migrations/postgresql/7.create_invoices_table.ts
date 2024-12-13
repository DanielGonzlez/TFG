import { BaseSchema } from '@adonisjs/lucid/schema';
import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';
import { DISCOUNT_TYPE } from '#types/invoice_type';
import { STATUS } from '#types/invoice_type';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.INVOICES;
  protected connection = 'postgresql';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('invoice_id').primary();
      table.string('organization_id').notNullable();
      table.string('client_id').notNullable();
      table.string('client_name').notNullable();
      table.string('currency').nullable();
      table.integer('tax_percent').notNullable().defaultTo(4);
      table.string('tax_name', 50).notNullable().defaultTo('IVA');
      table.enu('status', [STATUS.CREATED, STATUS.PAID, STATUS.CANCELLED, STATUS.RECURRING]).defaultTo(STATUS.CREATED);

      // Nuevos campos
      table.decimal('subtotal', 10, 2).notNullable().defaultTo(0);
      table.decimal('tax_total', 10, 2).notNullable().defaultTo(0);
      table.decimal('total', 10, 2).notNullable().defaultTo(0);

      table.timestamp('next_recurring_at').nullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
