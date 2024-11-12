import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Client from '#models/client_model'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliza import.meta.url para obtener la ruta al directorio actual
export default class ClientSeeder extends BaseSeeder {
  public async run() {
    // Obtén la ruta del archivo usando import.meta.url
    const filePath = path.join(__dirname, 
      '..', 
      '..', 
      'seeders', 
      'data', 
      'clients.json');
    
    // Lee el archivo JSON
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const clients = JSON.parse(rawData);

    // Procesa cada usuario y lo inserta en la base de datos
    for (const clientData of clients) {
      await Client.create({
        clientId: clientData.client_id, 
        userId: clientData.user_id, 
        organizationId: clientData.organization_id,  // Cambiado de 'user_id' a 'userId'
        fullName: clientData.full_name,  // Cambiado de 'first_name' a 'firstName'
        billingAddress: clientData.billing_address,    // Cambiado de 'last_name' a 'lastName'
        email: clientData.email,
        isWholesaler: clientData.is_wholesaler
      })
    }
  }
}
