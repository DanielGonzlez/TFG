// app/Controllers/Http/ClientController.ts
/*

import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user.service'
import ClientService from '#services/client.service'

const userService = new UserService()
const clientService = new ClientService()

export default class ClientController {
  public async showRegisterForm({ view }: HttpContext) {
    return view.render('pages/register')
  }

  public async register({ request, response }: HttpContext) {
    const data = request.only([
      'name', 'firstName', 'lastName', 'email', 'password',
      'billingAddress', 'isWholesaler', 'organizationId'
    ]);
  
    console.log(data); // Añadir esto para depurar
  
    try {
      // Crear el usuario
      const user = await userService.register(data)
  
      // Crear el cliente asociado
      const client = await user.related('client').create({
        fullName: `${data.firstName} ${data.lastName}`,
        billingAddress: data.billingAddress,
        email: data.email,
        isWholesaler: data.isWholesaler || false,
        organizationId: data.organizationId || null,
      });
  
      return response.created({
        message: 'Usuario y cliente creados exitosamente',
        user,
        client,
      });
    } catch (error) {
      console.log(error); // Para ver el error exacto
      return response.badRequest({
        message: 'Error al registrar usuario y cliente',
        error,
      })
    }
  }
  
}

*/
