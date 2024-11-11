import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user_model'

export default class AuthController {

  // Método para registrar un nuevo usuario
  public async register({ request, response }: HttpContext) {
    const userData = request.only(['email', 'password', 'name', 'firstName', 'lastName'])

    try {
      // Crear un nuevo usuario en la base de datos
      const user = await User.create(userData)

      return response.created({ message: 'Usuario registrado exitosamente', user })
    } catch (error) {
      return response.badRequest({ message: 'Error al registrar usuario', error })
    }
  }

  // Método para iniciar sesión
  public async login({ request, session, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.verifyCredentials(email, password)

      // Almacenar el ID del usuario en la sesión
      session.put('user_id', user.userId)

      return response.ok({ message: 'Inicio de sesión exitoso' })
    } catch {
      session.flash('error', 'Credenciales no válidas')
      return response.badRequest({ message: 'Credenciales incorrectas' })
    }
  }

  // Método para cerrar sesión
  public async logout({ session, response }: HttpContext) {
    // Eliminar el ID de usuario de la sesión
    session.forget('user_id')

    return response.ok({ message: 'Cierre de sesión exitoso' })
  }

  // Método para verificar si el usuario está autenticado
  public async check({ session, response }: HttpContext) {
    const userId = session.get('user_id')

    if (userId) {
      const user = await User.find(userId)
      return response.ok({ authenticated: true, user })
    } else {
      return response.unauthorized({ authenticated: false, message: 'No autenticado' })
    }
  }
}
