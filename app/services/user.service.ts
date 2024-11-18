import User from '#models/user_model';
import Hash from '@adonisjs/core/services/hash';

import { USER_ROL } from '#types/user_type';
import { USER_STATUS } from '#types/user_type';


export default class UserService {
  // Crear un usuario

  public async createUser(data: { name: string; firstName: string; lastName: string; email: string; password: string }) {

    const user = await User.create({
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      status: USER_STATUS.ACTIVE,
      rol: USER_ROL.CLIENT,
    })

    return user
  }

  public async validateUser(data: { email: string; password: string }) {
    const user = await User.query().where('email', data.email).firstOrFail()
    const storedPassword = user.password
    const isValid = await Hash.verify(storedPassword, data.password)
    if (isValid) {
      return user
    }
    throw new Error('Invalid credentials')
  }

  //enseñar informacion del usuario sacandola de la base de datos
  public async showUserInfo(userId: string) {
    const user = await User.query().where('userId', userId).first()
    return user
  }
}
