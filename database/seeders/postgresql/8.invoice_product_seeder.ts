import { BaseSeeder } from '@adonisjs/lucid/seeders';
import InvoiceProduct from '#models/invoiceProduct_model'; 
import { DateTime } from 'luxon';

export default class InvoiceProductSeeder extends BaseSeeder {
  public async run() {
    // Aquí definimos los productos con sus relaciones necesarias para invoice_products
    const invoiceProducts = [
      { invoice_id: "e113bd85-6487-4d76-9eb6-c1d3fe630650", product_id: "1", product_name: "PRODUCTO1", quantity: 1, created_at: DateTime.fromISO('2024-11-12T00:00:00Z'), updated_at: DateTime.fromISO('2024-11-12T00:00:00Z') },
      { invoice_id: "e113bd85-6487-4d76-9eb6-c1d3fe630650", product_id: "2", product_name: "PRODUCTO2", quantity: 2, created_at: DateTime.fromISO('2024-11-12T00:00:00Z'), updated_at: DateTime.fromISO('2024-11-12T00:00:00Z') },
      { invoice_id: "e113bd85-6487-4d76-9eb6-c1d3fe630650", product_id: "3", product_name: "PRODUCTO3", quantity: 1, created_at: DateTime.fromISO('2024-11-12T00:00:00Z'), updated_at: DateTime.fromISO('2024-11-12T00:00:00Z') },
      { invoice_id: "e113bd85-6487-4d76-9eb6-c1d3fe630650", product_id: "4", product_name: "PRODUCTO4", quantity: 3, created_at: DateTime.fromISO('2024-11-12T00:00:00Z'), updated_at: DateTime.fromISO('2024-11-12T00:00:00Z') },
      // Agrega el resto de los productos aquí...
    ];

    // Insertamos los datos de invoice_products en la base de datos
    for (const invoiceProductData of invoiceProducts) {
      await InvoiceProduct.create({
        invoiceId: invoiceProductData.invoice_id,    // Relación con la factura
        productId: invoiceProductData.product_id,    // Relación con el producto
        productName: invoiceProductData.product_name,    // Relación con el producto
        quantity: invoiceProductData.quantity,
        createdAt: invoiceProductData.created_at,
        updatedAt: invoiceProductData.updated_at,
      });
    }
  }
}
