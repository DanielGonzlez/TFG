import { BaseSeeder } from '@adonisjs/lucid/seeders'
import OrganizationAddress from '#models/organizationAdress_model';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliza import.meta.url para obtener la ruta al directorio actual
export default class OrganizationAddressesSeeder extends BaseSeeder {
  public async run() {
    // Obtén la ruta del archivo usando import.meta.url
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'organization_addresses.json');
    
    // Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const organizAdd = JSON.parse(rawData);

    // Procesa cada usuario y lo inserta en la base de datos
    for (const organizAddData of organizAdd) {
      await OrganizationAddress.create({
        addressId: organizAddData.address_id, 
        organizationId: organizAddData.organization_id, 
        country: organizAddData.country,  // Cambiado de 'first_name' a 'firstName'
        address: organizAddData.address,    // Cambiado de 'last_name' a 'lastName'
        province: organizAddData.province,
        town: organizAddData.town,
        postalCode: organizAddData.postal_code,
        type: organizAddData.type
      })
    }
  }
}
