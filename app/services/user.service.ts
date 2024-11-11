import User from '#models/user_model';
import type { createUserSchema } from '#validators/user_validator';
import { createError } from '@adonisjs/core/exceptions';
import type { Infer } from '@vinejs/vine/types';
import { randomUUID } from 'crypto';

export default class UserService {

  // Cargar detalles del usuario
  public async details(user: User) {
    await user.load('products');
    await user.load('invoiceSeries');
    await user.load('client');
    await user.load('administrator');
    
    return user;
  }

  // Registro de un nuevo usuario
  public async register(data: Infer<typeof createUserSchema>) {

    const {
      name,
      firstName,
      lastName,
      email,
      password,
    } = data;

    const _user = await User.findBy('email', email);

    if (_user) {
      throw createError('El correo no es válido.', 'API_USER_EMAIL_NOT_VALID');
    }

    const user = new User();

    await user.fill({
      user_id: randomUUID(),
      email,
      name,
      firstName,
      lastName,
      password,
    }).save();

    return user;
  }

  // Autenticación de usuario mediante sesión
  public async login(data: Record<string, string>, session: any) {

    const {
      email,
      password
    } = data;

    const user = await User.verifyCredentials(email, password);

    // Almacenar el ID del usuario en la sesión
    session.put('user_id', user.userId);

    return user;  // Devolvemos el usuario autenticado
  }

  // Cerrar sesión
  public async logout(session: any) {

    // Eliminar el ID de usuario de la sesión
    session.forget('user_id');

    return { message: 'Sesión cerrada exitosamente.' };
  }
}
