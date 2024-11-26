import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'product.json');
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(rawData);

    // * Procesa cada producto y lo inserta en la base de datos
    for (const productData of products) {
      await Product.create({
        productId: productData.product_id,
        adminId: productData.admin_id,
        name: productData.name,
        author: productData.author,
        description: productData.description,
        unit: productData.unit,
        price: productData.price,
        discount: productData.discount,
        discountType: productData.discount_type,
        image: productData.image,
        category: productData.category
      })
    }
  }
}
