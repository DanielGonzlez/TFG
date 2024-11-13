import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user.service'
import ClientService from '#services/client.service'
import { RegisterValidator } from '#validators/user_validator'

const userService = new UserService()
const clientService = new ClientService()

export default class AuthController {
  // Mostrar formulario de registro
  public async showRegisterForm({ view }: HttpContext) {
    return view.render('pages/register')
  }

  // Registrar usuario y cliente
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

      // Ajustar el valor de `lastName` para evitar incompatibilidades de tipo
      const userPayload = {
        ...validatedData,
        lastName: validatedData.lastName || '', // Asignar cadena vacía si `lastName` es `undefined`
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
}
