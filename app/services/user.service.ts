import User from '#models/user_model';
import hash from '@adonisjs/core/services/hash';

import { USER_ROL } from '#types/user_type';
import { USER_STATUS } from '#types/user_type';


export default class UserService {
  // Crear un usuario

  public async createUser(data: { name: string; firstName: string; lastName: string; email: string; password: string }) {

    const hashedPassword = await hash.make(data.password)

    const user = await User.create({
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      status: USER_STATUS.ACTIVE,
      rol: USER_ROL.CLIENT,
    })

    return user
  }

}
