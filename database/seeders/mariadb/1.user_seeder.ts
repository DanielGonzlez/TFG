import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user_model'
import { USER_STATUS } from '#types/user_type'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import hash from '@adonisjs/core/services/hash'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const filePath = path.join(__dirname,
      '..', 
      '..', 
      'seeders', 
      'data', 
      'users.json');
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(rawData);

    // * Procesa cada usuario y lo inserta en la base de datos
    for (const userData of users) {
      await User.create({
        userId: userData.user_id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        password: await hash.make(userData.password),
        status: USER_STATUS.ACTIVE, 
        rol: userData.rol
      })
    }
  }
}
