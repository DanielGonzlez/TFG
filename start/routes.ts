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
  
router.get('/register', [AuthController, 'showRegisterForm'])  //! Mostrar formulario de registro
router.post('/register', [AuthController, 'register']).as('register')  //! Registrar un usuario

//*Rutas para autenticación
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

router.post('/checkout', [PaymentController, 'checkout']).as('checkout')
router.post('/clear-cart', [PaymentController, 'clearCart']).as('clearCart')

//Route.post('/clear-cart', 'PaymentController.clearCart'); // Para borrar el carrito




/*
router.get('/login', 'UserController.showLoginForm')  // Mostrar formulario de login
router.post('/login', 'UserController.login').as('login')  // Iniciar sesión

// Aplicar el middleware de autenticación correctamente
router.get('/user-info', 'UserController.showUserInfo') // Mostrar información del usuario

router.post('/logout', 'UserController.logout').as('logout')  // Cerrar sesión


/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
/*
import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const AuthController = () => import('#controllers/auth.controller');
const HealthChecksController = () => import('#controllers/health_checks.controller');
const InvoicesController = () => import('#controllers/invoices.controller');
const OrganizationsController = () => import('#controllers/organizations.controller');
const UsersController = () => import('#controllers/users.controller');
const OrganizationAddressesController = () => import('#controllers/organization_addresses.controller');
const ProductsController = () => import('#controllers/products.controller');
const ClientsController = () => import('#controllers/clients.controller');
const InvoiceSeriesController = () => import('#controllers/invoice_series.controller');

router
	.group(() => {
		router.post('/login', [AuthController, 'login']);
		router.post('/register', [AuthController, 'register']);
		router.post('/logout', [AuthController, 'logout']);
	})
	.prefix('/auth');

router
	.group(() => {
		router.get('/me', [UsersController, 'details']);
		router.get('/statistics', [UsersController, 'statistics']).use(middleware.userHasOrganization());
	})
	.prefix('/user')
	.use(middleware.auth());

router
	.group(() => {
		router.post('/', [ClientsController, 'store']);
		router.get('/', [ClientsController, 'list']);

		router.delete('/:client_id', [ClientsController, 'destroy']).use([middleware.userHasClient(), middleware.userOwnershipClient()]);
	})
	.prefix('/client')
	.use(middleware.auth());

router
	.group(() => {
		router.post('/', [ProductsController, 'store']);
		router.delete('/:product_id', [ProductsController, 'destroy']);
	})
	.prefix('/product')
	.use(middleware.auth());

router
	.group(() => {
		router.post('/', [OrganizationsController, 'store']);
		router.get('/', [OrganizationsController, 'list']);

		router.group(() => {
			router.group(() => {
				router.post('/', [OrganizationAddressesController, 'store']);
				router.delete('/:organization_address_id', [OrganizationAddressesController, 'destroy']).use(middleware.userOwnershipOrganizationAddress());;
			}).prefix('/address');

			router.get('/:organization_id', [OrganizationsController, 'details']).use(middleware.userOwnershipOrganization());
			// router.put('/:organization_id', [OrganizationsController, 'edit']).use(middleware.userOwnershipOrganizationMiddleware());
			router.delete('/:organization_id', [OrganizationsController, 'destroy']).use(middleware.userOwnershipOrganization());
		}).use(middleware.userHasOrganization());
	})
	.prefix('/organization')
	.use(middleware.auth());

router
	.group(() => {
		router.get('/', [InvoicesController, 'list']);
		router.post('/', [InvoicesController, 'store']);

		// Nueva ruta para mostrar facturas actuales del usuario
        router.get('/current/sim/:id', [InvoicesController, 'showCurrentInvoices']).use(middleware.auth());
		router.get('/current/com/:id', [InvoicesController, 'showCurrentInvoices']).use(middleware.auth());
		router.get('/invoices', [InvoicesController, 'showInvoices']).use(middleware.auth());
		//router.get('/invoice/pdf', [InvoicesController, 'showInvoicePdf']).use(middleware.auth());

		router.group(() => {
			router.get('/', [InvoiceSeriesController, 'list']);
			router.post('/', [InvoiceSeriesController, 'store']);
			router.get('/:invoice_serie', [InvoiceSeriesController, 'details']);
		}).prefix('/serie');

		// router.group(() => {
		// 	router.post('/', [InvoicesController, 'import']);
		// }).prefix('/import');

		router.get('/:invoice_id', [InvoicesController, 'details']).use(middleware.userOwnershipInvoice());
		router.get('/:invoice_id/product', [InvoicesController, 'details']).use(middleware.userOwnershipInvoice());
		router.post('/:invoice_id/product', [InvoicesController, 'addProduct']).use(middleware.userOwnershipInvoice());

	})
	.prefix('/invoice')
	.use(middleware.auth());

router
	.get('/health', [HealthChecksController])
	.use(({ request, response }, next) => {
		if (request.header('x-monitoring-secret') === 'some_secret_value') {
			return next();
		}
		response.unauthorized({ message: 'Unauthorized access' });
	});

    */