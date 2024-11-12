import { BaseSchema } from '@adonisjs/lucid/schema';
import { MIGRATIONS_TABLE_NAME } from '#utils/dictionaries/migrations_table_names';
import { DISCOUNT_TYPE } from '#types/invoice_type';
import { STATUS } from '#types/invoice_type';

export default class extends BaseSchema {
  protected tableName = MIGRATIONS_TABLE_NAME.INVOICES;
  protected connection = 'postgresql';

  async up() {
    // Habilita la extensión uuid-ossp para que funcione uuid_generate_v4
    this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    this.schema.createTable(this.tableName, (table) => {
      // Utiliza uuid_generate_v4() correctamente
      table.uuid('invoice_id').primary();
      table.string('organization_id').notNullable()
      table.string('client_id').notNullable()
      table.string('client_name').notNullable();
      table.string('current_id').nullable();
      table.string('currency').nullable();
      table.decimal('discount', 10, 2).nullable();
      table.enu('discount_type', [DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]).nullable();
      table.string('one_off_products').nullable();
      table.integer('tax_percent').notNullable().defaultTo('21');
      table.string('tax_name', 50).notNullable().defaultTo('IVA');
      table.enu('status', [STATUS.CREATED, STATUS.PAID, STATUS.CANCELLED, STATUS.RECURRING]).defaultTo(STATUS.CREATED);
      table.timestamp('next_recurring_at').nullable();

      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}

