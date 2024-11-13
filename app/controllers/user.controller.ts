// app/Services/user.service.ts
import { v4 as uuidv4 } from 'uuid';
import User from '#models/user_model';

export default class UserService {
  public async register(data: { name: string; firstName: string; lastName: string; email: string; password: string }) {
    const user = await User.create({
      userId: uuidv4(),
      ...data,
    });

    return user;
  }
}
