import Product from '#models/product_model'
import { DEFAULT_IMAGE_PATH } from '#types/product_type'

import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import sharp from 'sharp'

export default class ProductService {

  public static async createProduct(data: any, adminId: string) {
    //* Verificar los datos que se reciben
    console.log("Datos para crear el producto:", data);
  
    const { name, author, description, price, discount, unit, category, discountType, image } = data;
  
    const producto = new Product();
    producto.adminId = adminId;
    producto.name = name;
    producto.author = author;
    producto.description = description;
    producto.price = price;
    producto.discount = discount;
    if (producto.discount === undefined) { //! ESTO DEBERÍA ESTAR MEJOR MANEJADO EN EL FUTURO
      producto.discount = 0
    }
    producto.unit = unit;
    producto.category = category;
    producto.discountType = discountType;
    producto.image = image;
    if (producto.image === null) {
      producto.image = DEFAULT_IMAGE_PATH
    }
  
    try {
      //* Guardar el producto
      await producto.save();
      console.log("Producto creado:", producto);
      return producto;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw new Error("Error al guardar el producto");
    }
  }
  
  //* Servicio para actualizar un producto
  public static async updateProduct(data: any, adminId: string, productId: string) {
    const product = await Product.find(productId);
  
    if (!product) {
      throw new Error("Producto no encontrado");
    }
  
    const { name, author, description, price, discount, unit, category, discountType, image } = data;
  
    //* Actualizamos el producto con los nuevos datos
    product.merge({
      adminId,
      name,
      author,
      description,
      price,
      discount: discount || 0,
      unit,
      category,
      discountType,
      image: image || product.image //* Si no hay nueva imagen, se mantiene la anterior
    });
  
    try {
      //* Guardar el producto actualizado
      await product.save();
      return product;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw new Error("Error al actualizar el producto");
    }
  }
  

  public static async saveImage(image: MultipartFile): Promise<string> {
    try {
      //* Verificar si el archivo fue subido correctamente
      if (!image || !image.isValid) {
        throw new Error('Imagen no válida.')
      }

      //* Generar un nombre único para la imagen
      const fileName = `${cuid()}.${image.extname}`

      //* Directorio temporal donde se guardará la imagen redimensionada
      const tempFilePath = app.makePath('public/assets/uploads', fileName)

      //* Redimensionar la imagen y guardarla en el directorio temporal
      await sharp(image.tmpPath)
        .resize({ width: 800 })  //* Cambiar el tamaño según sea necesario
        .jpeg({ quality: 80 })
        .toFile(tempFilePath)

      //* Mover la imagen redimensionada al directorio de destino
      await image.move(app.makePath('public/assets/uploads'), {
        name: fileName,
        overwrite: true
      })

      //* Devolver la URL de la imagen
      return `http://localhost:3333/public/assets/uploads/${fileName}`
    } catch (error) {
      console.error('Error al guardar la imagen:', error)
      return DEFAULT_IMAGE_PATH  //* Devuelve una imagen por defecto si ocurre un error
    }
}

  
}
