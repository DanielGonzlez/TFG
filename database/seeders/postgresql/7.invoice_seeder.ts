import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Invoice from '#models/invoice_model';
import { STATUS } from '#types/invoice_type';
import { DateTime } from 'luxon';

export default class InvoiceSeeder extends BaseSeeder {
  public async run() {
    const invoiceData = {
      organizationId: '1',
      clientId: '10',
      clientName: 'Juan Gómez',
      currency: 'EUR',
      invoiceId: 'e113bd85-6487-4d76-9eb6-c1d3fe630650',
      taxPercent: 4, // IVA
      taxName: 'IVA',
      status: STATUS.CREATED,
      subtotal: 190, // Por ejemplo, calculado manualmente
      taxTotal: 7.6, // 4% de 190
      total: 197.6, // subtotal + taxTotal
      nextRecurringAt: DateTime.fromISO('2026-12-01T00:00:00Z'),
      createdAt: DateTime.fromISO('2024-11-12T00:00:00Z'),
      updatedAt: DateTime.fromISO('2024-11-12T00:00:00Z'),
    };

    await Invoice.create(invoiceData);
  }
}
