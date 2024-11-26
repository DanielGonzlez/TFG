import { HttpContext } from "@adonisjs/core/http"
import User from "#models/user_model"

export default class AuthMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    //* Verifica si el usuario está autenticado
    const user = session.get('user')

    if (!user || !(await User.find(user.userId))) {
      //* Si no hay usuario en la sesión o no existe un usuario con esa id, redirige al login
      return response.redirect('/login')
    }

    await next()
  }
}