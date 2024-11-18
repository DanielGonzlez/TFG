import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user.service'
import ClientService from '#services/client.service'
import { RegisterValidator } from '#validators/user_validator'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user_model'

const userService = new UserService()
const clientService = new ClientService()

export default class AuthController {
  //! Mostrar formulario de registro
  public async showRegisterForm({ view }: HttpContext) {
    return view.render('pages/register')
  }

  //! Registrar usuario y cliente
  public async register({ request, response, session }: HttpContext) {
    const data = request.only([
      'name',
      'firstName',
      'lastName',
      'email',
      'password',
      'billingAddress',
      'isWholesaler',
      'organizationId',
    ])
  
    try {
      // Realizar validación utilizando el esquema de RegisterValidator
      const validatedData = await RegisterValidator.validate(data)
  
      // Hashear la contraseña
      const hashedPassword = await hash.make(validatedData.password)
  
      // Ajustar el valor de `lastName` para evitar incompatibilidades de tipo
      const userPayload = {
        ...validatedData,
        lastName: validatedData.lastName || '', // Asignar cadena vacía si `lastName` es `undefined`
        password: hashedPassword, // Utilizar la contraseña hasheada
      }
  
      // Crear el usuario
      const user = await userService.createUser(userPayload)
  
      // Crear cliente asociado al usuario
      await clientService.createClient({
        userId: user.userId,
        fullName: `${validatedData.firstName} ${validatedData.lastName || ''}`,
        billingAddress: validatedData.billingAddress,
        email: validatedData.email,
        isWholesaler: validatedData.isWholesaler || false,
        organizationId: validatedData.organizationId || null,
      })
  
      return response.redirect().toRoute('/')
    } catch (error) {
      if (error.errors) {
        // Si hay errores de validación, los almacenamos en la sesión
        session.flash('errors', error.errors)
        
        return response.redirect().back()
      }
      return response.badRequest({ error: error.message })
    }
  }

  //! Mostrar el formulario de login
  public async showLoginForm({ view }: HttpContext) {
    return view.render('pages/login')
  }

  //! Iniciar sesion
  public async login({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
  
    try {
      // Busca el usuario por email
      const user = await User.findBy('email', email)
  
      if (!user) {
        // Si no existe el usuario, redirige a registro
        session.flash({ error: 'Usuario no encontrado. Por favor, regístrate.' })
        return response.redirect('/register')
      }
  
      // Verifica si la contraseña es correcta
      const passwordValid = await hash.verify(user.password, password)
      if (!passwordValid) {
        // Si la contraseña es incorrecta, redirige al login
        session.flash({ error: 'Credenciales incorrectas.' })
        return response.redirect('/login')
      }
  
      // Guarda la sesión del usuario
      session.put('user', user) // Guardar el usuario en la sesión

      // Redirige a la página de inicio si la autenticación fue exitosa
      return response.redirect('/')
  
    } catch (error) {
      console.error('Error en el login:', error)
      session.flash({ error: 'Ocurrió un error inesperado. Inténtalo nuevamente.' })
      return response.redirect('/login')
    }
  }

  //! Cerrar sesion
  public async logout({ response, session }: HttpContext) {
    // Elimina la sesión del usuario
    session.forget('user')
  
    // Redirige al login o página de inicio
    return response.redirect('/login')
  }
  
  //! Enseñar la informacion del usuario 
  //TODO    AÚN NO IMPLEMENTADO
  public async showUserInformation(userId: string) {
    const user = await userService.showUserInfo(userId)
    return user
  }

  //! Mostrar la página de inicio
  //TODO    DE MOMENTO SOLO MUESTRA LOS DATOS DEL USUARIO
  public async home({ view, session }: HttpContext) {
    const user = session.get('user') // Recupera el usuario de la sesión
  
    return view.render('pages/home', { user }) // Pasa el usuario a la vista
  }
   
}
