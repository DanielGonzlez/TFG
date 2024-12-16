/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth.controller'
import ProductController from '#controllers/product.controller'
import { middleware } from './kernel.js'
import UserController from '#controllers/user.controller'
import PaymentController from '#controllers/payment.controller'
import InvoiceController from '#controllers/invoice.controller'
  
router.get('/register', [AuthController, 'showRegisterForm'])  //! Mostrar formulario de registro
router.post('/register', [AuthController, 'register']).as('register')  //! Registrar un usuario

//* Rutas para autenticación
router.get('/login', [AuthController, 'showLoginForm'])  //! Mostrar formulario de login
router.post('/login', [AuthController, 'login']).as('login')  //! Iniciar sesión

router.get('/logout', [AuthController, 'logout']).as('logout')  //! Cerrar sesión

//* Ruta para el manejo del producto
router.get('/products/create', [ProductController, 'showForm']).as('products.create').use(middleware.auth()) //! Mostrar el formulario de creación de productos
router.post('/products', [ProductController, 'store']).as('products.store') //! Crear un producto

router.get('/products/:productId/edit', [ProductController, 'showForm']).as('products.edit').use(middleware.auth()) //! Mostrar el formulario de edición de productos
router.put('/products/:productId', [ProductController, 'update']).as('products.update') //! Actualizar un producto
router.delete('/products/:productId', [ProductController, 'delete']).as('products.delete') //! Eliminar un producto

router.get('/products/:productId', [ProductController, 'show']).as('products.show') //! Mostrar detalle de un producto

router.get('/user/profile', [UserController, 'profile']).as('user.profile').use(middleware.auth()) //! Ruta con la informacion del usuario

//* Rutas para las vistas

router.get('/', [ProductController, 'home']).as('home')
router.get('/products', [ProductController, 'products']).as('products')

//* Rutas para el carrito

router.post('/cart/add', [ProductController, 'addToCart']).as('cart.add')
router.get('/cart', [ProductController, 'showCart']).as('cart.show')
router.post('/cart/update-quantity/:productId', [ProductController, 'updateCartQuantity'])
router.delete('/cart/remove/:productId', [ProductController, 'removeFromCart'])

//* Rutas para el pago

router.post('/checkout', [PaymentController, 'checkout']).as('checkout').use(middleware.client())
router.post('/clear-cart', [PaymentController, 'clearCart']).as('clearCart')

router.get('/buy-now/:productId', [PaymentController, 'buyNowPage']).as('buyNowPage').use(middleware.client())
router.post('/create-payment-intent/:productId', [PaymentController, 'createPaymentIntent']).as('createPaymentIntent');

router.get('invoice/:invoiceId/html', [InvoiceController, 'showInvoiceHTML']).as('invoice.see').use(middleware.client())
router.get('invoice/:invoiceId/pdf', [InvoiceController, 'downloadInvoicePDF']).as('invoice.download').use(middleware.client())
