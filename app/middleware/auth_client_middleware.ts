import { HttpContext } from "@adonisjs/core/http"
import User from "#models/user_model"
import Client from "#models/client_model"

export default class AuthClientMiddleware {
  public async handle({ session, response }: HttpContext, next: () => Promise<void>) {
    //* Verifica si el usuario está autenticado
    const user = session.get('user')

    if (!user || !(await User.find(user.userId))) {
      //* Si no hay usuario en la sesión o no existe un usuario con esa id, redirige al login
      return response.redirect('/login')
    }

    //* Verificar si el usuario tiene un cliente asociado
    const client = await Client.query().where('userId', user.userId).first()

    if (!client) {
      //* Si no existe un cliente con la id del usuario, redirige al registro de cliente
      return response.redirect('/login')
    }

    await next()
  }
}
