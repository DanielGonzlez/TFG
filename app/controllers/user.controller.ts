import { HttpContext } from "@adonisjs/core/http";
import { USER_ROL } from "#types/user_type";
import { DateTime } from "luxon";
import Client from "#models/client_model";
import InvoiceController from "./invoice.controller.js";

export default class UserController {
  public async profile({ session, view, response }: HttpContext) {
    const user = session.get('user');

    if (!user) {
      response.redirect('/login'); //* Redirige al login si no hay un usuario en la sesión
      return;
    }

    // Formatear fecha de creación del usuario
    const createdAt = user.createdAt;
    const formattedDate = DateTime.fromISO(createdAt).setLocale('es').isValid
      ? DateTime.fromISO(createdAt).setLocale('es').toFormat('d \'de\' MMMM \'de\' yyyy')
      : 'Fecha no válida';

    // Buscar cliente asociado al usuario
    const client = await Client.findBy('user_id', user.userId);
    const billAdd = client?.billingAddress;
    if (!client) {
      return view.render('pages/user-profile', {
        user,
        USER_ROL,
        billAdd,
        formattedDate,
        invoices: [],
        error: "No se encontró un cliente asociado al usuario.",
      });
    }

    // Delegar la obtención de las facturas al InvoiceController
    const invoiceController = new InvoiceController();
    const invoices = await invoiceController.getClientInvoices(client.clientId);

    // Renderizar vista con las facturas
    return view.render('pages/user-profile', {
      user,
      USER_ROL,
      billAdd,
      formattedDate,
      invoices,
    });
  }
}
