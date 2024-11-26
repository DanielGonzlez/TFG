import { BaseSeeder } from '@adonisjs/lucid/seeders'
import OrganizationAddress from '#models/organizationAdress_model';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class OrganizationAddressesSeeder extends BaseSeeder {
  public async run() {
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'organization_addresses.json');
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const organizAdd = JSON.parse(rawData);

    // * Procesa cada usuario y lo inserta en la base de datos
    for (const organizAddData of organizAdd) {
      await OrganizationAddress.create({
        addressId: organizAddData.address_id, 
        organizationId: organizAddData.organization_id, 
        country: organizAddData.country,
        address: organizAddData.address,
        province: organizAddData.province,
        town: organizAddData.town,
        postalCode: organizAddData.postal_code,
        type: organizAddData.type
      })
    }
  }
}
