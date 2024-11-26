import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organization from '#models/organization_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class OrganizationSeeder extends BaseSeeder {
  public async run() {
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'organizations.json');
    
    // * Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const organizations = JSON.parse(rawData);

    // * Procesa cada organizacion y lo inserta en la base de datos
    for (const organizationData of organizations) {
      await Organization.create({
        organizationId: organizationData.organization_id,
        name: organizationData.name,
        fiscalId: organizationData.fiscal_id,
        logo: organizationData.logo,
      })
    }
  }
}
