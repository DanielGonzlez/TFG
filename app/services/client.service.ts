import Client from "#models/client_model";

export default class ClientService {
  // Crear cliente
  public async createClient(data: { userId: string; fullName: string; billingAddress: string; email: string }) {
    const client = await Client.create(data) // Crear cliente relacionado

    return client
  }
}
