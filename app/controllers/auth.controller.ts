import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user.service'
import ClientService from '#services/client.service'
import { RegisterValidator } from '#validators/user.validator'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user_model'
import { CartItem } from './product.controller.js'

const userService = new UserService()
const clientService = new ClientService()

export default class AuthController {
  //! Mostrar formulario de registro
  public async showRegisterForm({ view, session }: HttpContext) {
    const cartData = session.get('cart');
  
    const cart: CartItem[] = cartData ? Object.values(cartData) : [];
    return view.render('pages/register', { cart })
  }

  //! Registrar usuario y cliente
  public async register({ request, response, session }: HttpContext) {
    const data = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'billingAddress',
    ])
  
    try {
      const validatedData = await RegisterValidator.validate(data)

      const hashedPassword = await hash.make(validatedData.password)

      const userPayload = {
        ...validatedData,
        lastName: validatedData.lastName || '',
        password: hashedPassword,
      }

      const user = await userService.createUser(userPayload)

      await clientService.createClient({
        userId: user.userId,
        fullName: `${validatedData.firstName} ${validatedData.lastName || ''}`,
        billingAddress: validatedData.billingAddress,
        email: validatedData.email
      })
  
      return response.redirect().toRoute('/')
    } catch (error) {
      if (error.errors) {
        
        session.flash('errors', error.errors)
        
        return response.redirect().back()
      }
      return response.badRequest({ error: error.message })
    }
  }

  //! Mostrar el formulario de login
  public async showLoginForm({ view, session }: HttpContext) {
    const cartData = session.get('cart');
  
    const cart: CartItem[] = cartData ? Object.values(cartData) : [];
    return view.render('pages/login', { cart })
  }

  //! Iniciar sesion
  public async login({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
  
    try {
      const user = await User.findBy('email', email)
  
      if (!user) {
        session.flash({ error: 'Usuario no encontrado. Por favor, regístrate.' })
        return response.redirect('/register')
      }

      const passwordValid = await hash.verify(user.password, password)
      if (!passwordValid) {
        
        session.flash({ error: 'Credenciales incorrectas.' })
        return response.redirect('/login')
      }

      session.put('user', user)

      return response.redirect('/')
  
    } catch (error) {
      console.error('Error en el login:', error)
      session.flash({ error: 'Ocurrió un error inesperado. Inténtalo nuevamente.' })
      return response.redirect('/login')
    }
  }

  //! Cerrar sesion
  public async logout({ response, session }: HttpContext) {
    session.forget('user')

    return response.redirect('/')
  }
   
}
