import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Administrator from '#models/administrator_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class AdministratorSeeder extends BaseSeeder {
  public async run() {
    
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'administrators.json');
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const admins = JSON.parse(rawData);

    // * Procesa cada admin y lo inserta en la base de datos
    for (const adminData of admins) {
      await Administrator.create({
        adminId: adminData.admin_id,
        userId: adminData.user_id,
        fullName: adminData.full_name,
      })
    }
  }
}
