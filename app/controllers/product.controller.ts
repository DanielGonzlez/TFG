import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product_model'
import ProductService from '#services/product.service' 
import { createProductValidator } from '#validators/product.validator'
import { USER_ROL } from '#types/user_type'
import { DEFAULT_IMAGE_PATH } from '#types/product_type'
import Administrator from '#models/administrator_model'
import { DISCOUNT_TYPE, CATEGORY_TYPE } from '#types/product_type'

export default class ProductController {
    
    // Mostrar el formulario de creación o edición de producto

    /*public async home({ view, session }: HttpContext) {
      const user = session.get('user') // Recupera el usuario de la sesión
    
      return view.render('pages/home', { user, USER_ROL }) // Pasa el usuario a la vista
    }
      */
    public async showForm({ params, view, session }: HttpContext) {
      const user = session.get('user')
      const producto = params.productId ? await Product.find(params.productId) : null; 
      const modoCreacion = !producto; //* Determinamos si estamos en modo creación
      const rutaAction = modoCreacion ? 'products.store' : 'products.update'; //* Ruta para el formulario
      const productoData = producto || {}; //* Datos del producto si está en modo edición
      
      const categories = Object.values(CATEGORY_TYPE);
    
      return view.render('pages/products', {
        categories,
        modoCreacion,
        rutaAction,
        user,
        USER_ROL,
        DISCOUNT_TYPE,
        producto: productoData,
      });
    }
    
  public async create({ request, response, session }: HttpContext) {
    try {
      //* Obtener los datos del formulario
      const { name, price, discount, unit, category, discountType, author, description } = request.only([
        'name', 'price', 'discount', 'unit', 'category', 'discountType', 'author', 'description'
      ]);

      //* Validar los datos utilizando el validador
      const validatedData = await createProductValidator.validate({ 
        name, 
        price, 
        discount, 
        unit, 
        category, 
        discountType, 
        author, 
        description, 
        image: request.file('image')
      });

      const image = request.file('image');
      
      //* Si la imagen es válida, intentamos guardarla
      const imagePath = image ? await ProductService.saveImage(image) : DEFAULT_IMAGE_PATH;

      const user = session.get('user')!; //* Cargar el usuario autenticado desde la sesión

      if (!user) {
        throw new Error('No se ha encontrado un usuario en la sesión de autenticación');
      }

      //* Buscar el administrador relacionado con el userId del usuario
      const administrator = await Administrator.query()
        .where('userId', user.userId) //* Comparar userId del usuario con el de la tabla administrators
        .first();

      //* Validar que se haya encontrado un administrador
      if (!administrator) {
        throw new Error('El usuario autenticado no está asociado a un administrador');
      }
      const adminId = administrator.adminId;

      //* Preparar los datos del producto
      const productData = {
        ...validatedData,
        image: imagePath,  //* Asignar la ruta de la imagen guardada
        created_at: new Date(),
        updated_at: new Date(),
      };

      //* Llamar al servicio para crear el producto (solo creará el producto)
      await ProductService.createProduct(productData, adminId);

      //* Redirigir a la página principal 
      //? Plantearse si debe redirigir a la pantalla de edición
      return response.redirect('/');

    } catch (error) {
      //* Capturar y devolver cualquier error en el proceso de validación o creación
      console.error("Error en el proceso de creación de producto:", error);
      return response.status(400).send('Error al crear el producto. Intente nuevamente.');
    }
  }
    
  //* Almacenar el producto y redirigir
  public async store({ request, response, session }: HttpContext) {
    try {
      //* Obtener todos los datos enviados en el formulario
      const data = request.all();
      

      //* Validar los datos utilizando el validador
      const validatedData = await createProductValidator.validate({ 
        ...data, 
        image: request.file('image') 
      });

      //* Obtener el archivo de imagen del formulario
      const image = request.file('image');
      
      //* Intentar guardar la imagen si se proporciona
      let imagePath = null;
      if (image) {
        imagePath = await ProductService.saveImage(image);
      }

      //* Cargar el usuario autenticado desde la sesión
      const user = session.get('user')!;

      //* Validar que el usuario exista
      if (!user) {
        throw new Error('No se ha encontrado un usuario en la sesión de autenticación');
      }

      //* Buscar el administrador relacionado con el userId del usuario
      const administrator = await Administrator.query()
        .where('userId', user.userId) //* Comparar userId del usuario con el de la tabla administrators
        .first();

      //* Validar que se haya encontrado un administrador
      if (!administrator) {
        throw new Error('El usuario autenticado no está asociado a un administrador');
      }

      //* Extraer el adminId
      const adminId = administrator.adminId;

      
      //* Crear el producto con los datos validados
      const productData = { ...validatedData, image: imagePath };

      //* Llamar al servicio para crear el producto
      await ProductService.createProduct(productData, adminId);

      //* Redirigir a la página principal
      return response.redirect('/');

    } catch (error) {
      //* Manejo de errores en la validación o creación del producto
      console.error("Error en el proceso de validación o creación de producto:", error);
      return response.status(400).send(`Error al crear el producto. Intente nuevamente. Detalles: ${error.message}`);
    }
  }
  
  public async edit({ params, response, view }: HttpContext) {
    try {
      //* Buscar el producto por ID
      const productId = params.productId;
      const product = await Product.find(productId);
  
      //* Verificar si el producto existe
      if (!product) {
        response.status(404).send('Producto no encontrado');
        return;
      }
  
      //* Mostrar la vista de edición con los datos del producto
      return view.render('product.edit', { product });
      
    } catch (error) {
      console.error("Error al cargar el producto para editar:", error);
      response.status(400).send('Error al cargar los datos para editar el producto');
    }
  }
  
  public async update({ params, request, response, session }: HttpContext) {
    try {
      //* Obtener los datos enviados en el formulario de edición
      const { name, price, discount, unit, category, discountType, author, description } = request.only([
        'name', 'price', 'discount', 'unit', 'category', 'discountType', 'author', 'description'
      ]);
  
      //* Validar los datos utilizando el validador
      const validatedData = await createProductValidator.validate({
        name, 
        price, 
        discount, 
        unit, 
        category, 
        discountType, 
        author, 
        description, 
        image: request.file('image')
      });
  
      //* Obtener el archivo de imagen del formulario
      const image = request.file('image');
      
      //* Si se proporciona una imagen nueva se guardará
      const imagePath = image ? await ProductService.saveImage(image) : null; //* Si no se proporciona, se mantiene la imagen existente
  
      //* Buscar el producto en la base de datos
      const product = await Product.find(params.productId);
      if (!product) {
        return response.status(404).send('Producto no encontrado');
      }
  
      //* Cargar el usuario autenticado desde la sesión
      const user = session.get('user');
      if (!user) {
        throw new Error('No se ha encontrado un usuario en la sesión de autenticación');
      }
  
      //* Buscar el administrador relacionado con el userId del usuario
      const administrator = await Administrator.query()
        .where('userId', user.userId)
        .first();
  
      if (!administrator) {
        throw new Error('El usuario autenticado no está asociado a un administrador');
      }
  
      //* Preparar los datos actualizados del producto
      const updatedData = {
        ...validatedData,
        image: imagePath || product.image,  //* Si no hay nueva imagen, se mantiene la existente
        updated_at: new Date(),
      };
  
      //* Actualizar el producto en la base de datos
      product.merge(updatedData);
      await product.save();
  
      //* Redirigir a la página principal después de la actualización
      return response.redirect('/');
  
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      response.status(400).send(`Error al actualizar el producto. Intente nuevamente. Detalles: ${error.message}`);
    }
  }
  
    
}
