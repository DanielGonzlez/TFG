import { HttpContext } from '@adonisjs/core/http'
import { USER_ROL } from '#types/user_type'
import Administrator from '#models/administrator_model'

export default class AdminMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    //* Obtener el usuario de la sesión
    const user = session.get('user')

    //* Verifica si el usuario está autenticado
    if (!user) {
      return response.redirect('/login')  //* Redirige a login si no está autenticado
    }

    //* Verifica si el usuario tiene el rol de ADMIN y si existe un administrador asociado al usuario
    if (user.role !== USER_ROL.ADMIN || !(await Administrator.query().where('userId', user.userId).first())) {
      return response.redirect('/')  //! Redirige a la página principal de momento
    }

    await next()
  }
}
