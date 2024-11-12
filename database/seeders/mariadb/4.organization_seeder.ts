import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliza import.meta.url para obtener la ruta al directorio actual
export default class OrganizationSeeder extends BaseSeeder {
  public async run() {
    // Obtén la ruta del archivo usando import.meta.url
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'organizations.json');
    
    // Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const organizations = JSON.parse(rawData);

    // Procesa cada usuario y lo inserta en la base de datos
    for (const productData of organizations) {
      await Organization.create({
        organizationId: productData.organization_id,  // Cambiado de 'user_id' a 'userId'
        name: productData.name,  // Cambiado de 'first_name' a 'firstName'
        fiscalId: productData.fiscal_id,    // Cambiado de 'last_name' a 'lastName'
        logo: productData.logo,
      })
    }
  }
}
