import { BaseSeeder } from '@adonisjs/lucid/seeders';
import InvoiceProduct from '#models/invoiceProduct_model'; 
import { DateTime } from 'luxon';
import { DISCOUNT_TYPE } from '#types/invoice_type';

export default class InvoiceProductSeeder extends BaseSeeder {
  public async run() {
    const invoiceProducts = [
      {
        invoice_id: "e113bd85-6487-4d76-9eb6-c1d3fe630650",
        product_id: "1",
        product_name: "PRODUCTO1",
        quantity: 1,
        price: 100,
        discounted_price: 95,
        discount: 5,
        discount_type: DISCOUNT_TYPE.PERCENTAGE,
        tax: 3.8,
        created_at: DateTime.fromISO('2024-11-12T00:00:00Z'),
        updated_at: DateTime.fromISO('2024-11-12T00:00:00Z'),
      }
    ];

    for (const invoiceProductData of invoiceProducts) {
      await InvoiceProduct.create(invoiceProductData);
    }
  }
}
