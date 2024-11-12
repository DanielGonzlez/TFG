import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user_model'
import { USER_STATUS } from '#types/user_type'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliza import.meta.url para obtener la ruta al directorio actual
export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Obtén la ruta del archivo usando import.meta.url
    const filePath = path.join(__dirname,
      '..', 
      '..', 
      'seeders', 
      'data', 
      'users.json');
    
    // Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(rawData);

    // Procesa cada usuario y lo inserta en la base de datos
    for (const userData of users) {
      await User.create({
        userId: userData.user_id,  // Cambiado de 'user_id' a 'userId'
        name: userData.name,
        firstName: userData.first_name,  // Cambiado de 'first_name' a 'firstName'
        lastName: userData.last_name,    // Cambiado de 'last_name' a 'lastName'
        email: userData.email,
        password: userData.password,
        status: USER_STATUS.ACTIVE, // Asegúrate de que 'status' se maneje correctamente
      })
    }
  }
}
