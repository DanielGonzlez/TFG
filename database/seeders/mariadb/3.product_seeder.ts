import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product_model'
import { DISCOUNT_TYPE } from '#types/product_type'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliza import.meta.url para obtener la ruta al directorio actual
export default class ProductSeeder extends BaseSeeder {
  public async run() {
    // Obtén la ruta del archivo usando import.meta.url
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'product.json');
    
    // Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(rawData);

    // Procesa cada usuario y lo inserta en la base de datos
    for (const productData of products) {
      await Product.create({
        productId: productData.product_id,  // Cambiado de 'user_id' a 'userId'
        adminId: productData.admin_id,
        name: productData.name,  // Cambiado de 'first_name' a 'firstName'
        unit: productData.unit,    // Cambiado de 'last_name' a 'lastName'
        price: productData.price,
        discount: productData.discount,
        discountType: DISCOUNT_TYPE.PERCENTAGE, // Asegúrate de que 'status' se maneje correctamente
      })
    }
  }
}
