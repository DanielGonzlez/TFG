import { HttpContext } from "@adonisjs/core/http"
import { USER_ROL } from "#types/user_type"
import { DateTime } from "luxon"

export default class UserController {

  public async profile({ session, view, response }: HttpContext) {
    const user = session.get('user') 

    if (!user) {
      response.redirect('/login') //* Redirige al login si no hay un usuario en la sesión
      return
    }

    const createdAt = user.createdAt
    const formattedDate = DateTime.fromISO(createdAt).setLocale('es').isValid
      ? DateTime.fromISO(createdAt).setLocale('es').toFormat('d \'de\' MMMM \'de\' yyyy')
      : 'Fecha no válida'

    return view.render('pages/user-profile', {
      user, USER_ROL, formattedDate
    })
  }
}
  
