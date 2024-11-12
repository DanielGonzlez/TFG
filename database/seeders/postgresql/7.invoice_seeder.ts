import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Invoice from '#models/invoice_model'
import { STATUS, DISCOUNT_TYPE } from '#types/invoice_type'
import { DateTime } from 'luxon'

export default class InvoiceSeeder extends BaseSeeder {
  public async run() {
    const invoiceData = {
      organizationId: '1',
      clientId: '10',
      clientName: 'Juan Gómez',
      currentId: '1',
      currency: 'EUR',
      discount: 5,
      discountType: DISCOUNT_TYPE.PERCENTAGE,  // Verifica que aquí esté el valor correcto del enum
      invoiceId: 'e113bd85-6487-4d76-9eb6-c1d3fe630650',
      nextRecurringAt: DateTime.fromISO('2026-12-01T00:00:00Z'),
      oneOffProducts: 'Product A',
      status: STATUS.CREATED,
      taxPercent: 21,
      taxName: 'IVA',
      createdAt: DateTime.fromISO('2024-11-12T00:00:00Z'),
      updatedAt: DateTime.fromISO('2024-11-12T00:00:00Z'),
    }

    await Invoice.create(invoiceData)
  }
}
