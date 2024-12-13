import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PATH_PRODUCT_IMAGE } from '#utils/dictionaries/path_product_image'  // Importar el enum de las imágenes

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'seeders',
      'data',
      'product.json'
    )
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const products = JSON.parse(rawData)

    // * Procesa cada producto
    for (const productData of products) {
      // Reemplaza el identificador de la imagen por la ruta real
      const imageKey = productData.image
      const imageUrl = PATH_PRODUCT_IMAGE[imageKey as keyof typeof PATH_PRODUCT_IMAGE] || productData.image // Accede al valor del enum

      // Inserta el producto en la base de datos
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
        image: imageUrl, // Usa la URL procesada para la imagen
        category: productData.category
      })
    }
  }
}
