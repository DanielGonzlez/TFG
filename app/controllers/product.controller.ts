import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product_model'
import ProductService from '#services/product.service' 
import { createProductValidator } from '#validators/product.validator'
import { USER_ROL } from '#types/user_type'
import { DEFAULT_IMAGE_PATH } from '#types/product_type'
import Administrator from '#models/administrator_model'
import { DISCOUNT_TYPE, CATEGORY_TYPE } from '#types/product_type'

//! ESTO HABRÍA QUE SACARLO FUERA DEL CONTROLADOR
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discountedPrice: number;
}

export default class ProductController {
    
  //! Mostrar la página de inicio
  public async home({ view, session }: HttpContext) {

    //* Obtener 5 productos aleatorios (firstProducts)
    // TODO  Cambiar logica para que coja los productos segun una logica de ventas
    const firstProducts = await Product.query().orderByRaw('RAND()').limit(5);

    //* Obtener el usuario de la sesión
    const user = session.get('user');
    const cartData = session.get('cart');

    const cart: CartItem[] = cartData ? Object.values(cartData) : [];

    return view.render('pages/home', {
        user,
        cart,
        USER_ROL,
        firstProducts,
    });
}
  public async products({ view, session, request }: HttpContext) {
    const perPage = 16;
    const searchTerm = request.input('search', '').trim();
    const page = Number(request.input('page', 1));
    const offset = (page - 1) * perPage;

    //* Filtros
    const selectedPriceRange = request.input('priceRange', []);
    const selectedCategories = request.input('categories', []);

    //* Crear la consulta inicial para los productos de 15 en 15
    let productsQuery = Product.query().limit(perPage).offset(offset);

    //* Si hay una palabra de búsqueda, agregar condiciones para buscar en nombre, autor y categoría
    if (searchTerm) {
        productsQuery = productsQuery
            .where('name', 'LIKE', `%${searchTerm}%`)
            .orWhere('author', 'LIKE', `%${searchTerm}%`)
            .orWhere('category', 'LIKE', `%${searchTerm}%`);
    }

    //* Filtros de precio
    //  TODO  Cambiar esto para que sea una funcion aparte
    if (selectedPriceRange.length > 0) {
        productsQuery = productsQuery.where((builder) => {
            selectedPriceRange.forEach((range: string) => {
                if (range === '0-8') {
                    builder.where('price', '>=', 0).andWhere('price', '<=', 8);
                }
                if (range === '8-15') {
                    builder.orWhere('price', '>=', 8).andWhere('price', '<=', 15);
                }
                if (range === '15-30') {
                    builder.orWhere('price', '>=', 15).andWhere('price', '<=', 30);
                }
                if (range === '30-45') {
                    builder.orWhere('price', '>=', 30).andWhere('price', '<=', 45);
                }
                if (range === '45+') {
                    builder.orWhere('price', '>=', 45);
                }
            });
        });
    }

    //* Filtros de categorías
    if (selectedCategories.length > 0) {
        productsQuery = productsQuery.whereIn('category', selectedCategories);
    }

    //* Obtener los productos filtrados
    const products = await productsQuery.exec();

    //* Obtener 5 productos aleatorios (firstProducts)
    //TODO  Cambiar logica para que coja los productos segun una logica de ventas
    const firstProducts = await Product.query().orderByRaw('RAND()').limit(5);

    //* Obtener el total de productos con el mismo filtro de búsqueda o sin filtro
    let totalQuery = Product.query();
    if (searchTerm) {
        totalQuery = totalQuery
            .where('name', 'LIKE', `%${searchTerm}%`)
            .orWhere('author', 'LIKE', `%${searchTerm}%`)
            .orWhere('category', 'LIKE', `%${searchTerm}%`);
    }

    if (selectedPriceRange.length > 0) {
        totalQuery = totalQuery.where((builder) => {
            selectedPriceRange.forEach((range: string) => {
                if (range === '0-8') {
                    builder.where('price', '>=', 0).andWhere('price', '<=', 8);
                }
                if (range === '8-15') {
                    builder.orWhere('price', '>=', 8).andWhere('price', '<=', 15);
                }
                if (range === '15-30') {
                    builder.orWhere('price', '>=', 15).andWhere('price', '<=', 30);
                }
                if (range === '30-45') {
                    builder.orWhere('price', '>=', 30).andWhere('price', '<=', 45);
                }
                if (range === '45+') {
                    builder.orWhere('price', '>=', 45);
                }
            });
        });
    }

    if (selectedCategories.length > 0) {
        totalQuery = totalQuery.whereIn('category', selectedCategories);
    }

    const totalResult = await totalQuery.count('* as total');
    const total = totalResult[0].$extras.total;
    const totalPages = Math.ceil(total / perPage);

    const user = session.get('user');
    const cartData = session.get('cart');

    const cart: CartItem[] = cartData ? Object.values(cartData) : [];

    //* Obtener las categorías disponibles para los filtros
    const categories = Object.values(CATEGORY_TYPE);

    return view.render('pages/products-page', {
        user,
        USER_ROL,
        products,
        firstProducts,  //! Pasar los 5 productos aleatorios a la vista
        page,
        totalPages,
        perPage,
        total,
        searchTerm,
        categories,
        selectedCategories,
        selectedPriceRange,
        cart,
    });
}

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
    
  //! Almacenar el producto y redirigir
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

  public async show({ params, view, session }: HttpContext) {
    const user = session.get('user')
    const cartData = session.get('cart');

    const cart: CartItem[] = cartData ? Object.values(cartData) : [];
    const product = await Product.findOrFail(params.productId);
    const discountedPrice = product.getDiscountedPrice().toFixed(2);

    //* Obtener 5 productos aleatorios (firstProducts)
    // TODO  Cambiar por productos de la misma categoría
    const categoryProducts = await Product.query()
      .where('category', product.category)
      .orderByRaw('RAND()')
      .limit(5);

    return view.render('pages/product-detail', {
      product: {
        productId: product.productId,
        image: product.image,
        name: product.name,
        author: product.author,
        description: product.description,
        category: product.category,
        price: product.price,
        discount: product.discount,
        discountType: product.discountType,
        discountedPrice,
      }, user, USER_ROL, categoryProducts, cart
    });
    
  }
  
  public async delete({ params, response }: HttpContext) {
    try {
      const product = await Product.find(params.productId);

      if (!product) {
        response.status(404).send('Producto no encontrado');
        return;
      }

      await product.delete();
      return response.redirect('/');

    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      response.status(400).send('Error al eliminar el producto', error);
    }
  }
  
  public async addToCart({ request, session }: HttpContext) {
    const { productId } = request.only(['productId']);

    //! Validar que se recibe un productId
    if (!productId) {
        return { error: 'ID del producto no proporcionado', status: 400 };
    }

    const product = await Product.find(productId);

    //* Verificar que el producto existe en la base de datos
    if (!product) {
        return { error: 'Producto no encontrado', status: 404 };
    }

    //* Obtener el carrito actual o crear uno vacío
    let cart = session.get('cart') || {};

    //* Si el producto ya está en el carrito, incrementar la cantidad
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        //* Si no está en el carrito, agregarlo con cantidad 1
        cart[productId] = {
            productId: product.productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            discountedPrice: product.getDiscountedPrice(),
        };
    }

    session.put('cart', cart);

    //* Calcular la cantidad total de productos en el carrito
    const totalQuantity = Object.values(cart).reduce((total: number, item: any) => {
        return total + item.quantity;
    }, 0);

    return {
        totalQuantity,
    };
  }

  public async showCart({ view, session }: HttpContext) {

    const cartData = session.get('cart');
    console.log('Cart data from session:', cartData);

    //* Convertir el objeto en un array
    const cart: CartItem[] = cartData ? Object.values(cartData) : [];

    //* Calcular el precio total del carrito
    let totalPrice = 0;
    cart.forEach(item => {
        const price = item.discountedPrice ? item.discountedPrice : item.price;
        totalPrice += price * item.quantity;
    });
    totalPrice = parseFloat(totalPrice.toFixed(2)); //* Redondear a 2 decimales y mostrar siempre 2 decimales

    console.log('Processed cart:', cart);
    console.log('Total price:', totalPrice);

    return view.render('pages/cart', {
        cart,
        totalPrice
    });
  }

  public async removeFromCart({ params, session }: HttpContext) {
    const productId = params.productId;
    let cart = session.get('cart') || {};

    if (cart[productId]) {
        delete cart[productId];
    }

    session.put('cart', cart);

    //* Calcular la cantidad total de productos en el carrito
    const totalQuantity = Object.values(cart).reduce((total: number, item: any) => {
        return total + item.quantity;
    }, 0);

    return {
        cart,
        totalQuantity
    };
  }

  public async updateCartQuantity({ params, request, session }: HttpContext) {
    const productId = params.productId;
    const change = Number(request.input('change')); //* -1 para reducir, 1 para aumentar

    if (isNaN(change) || ![-1, 1].includes(change)) {
        return {
            message: 'Cambio no válido',
            status: 400
        };
    }

    let cart = session.get('cart') || {};

    if (!cart[productId]) {
        return {
            message: 'Producto no encontrado en el carrito',
            status: 404
        };
    }

    cart[productId].quantity += change;

    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }

    session.put('cart', cart);

    //! Calcular la cantidad total de productos en el carrito
    // TODO:  Pasar esto a una funcion del servicio
    const totalQuantity = Object.values(cart).reduce((total: number, item: any) => {
        return total + item.quantity;
    }, 0);

    return {
        cart,
        totalQuantity,
        status: 200
    };
  }

}
