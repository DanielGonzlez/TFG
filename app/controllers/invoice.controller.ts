import { HttpContext } from "@adonisjs/core/http";
import Invoice from "#models/invoice_model";
import InvoiceProduct from "#models/invoiceProduct_model";
import path from "path";
import fs from "fs";
import { chromium } from 'playwright';
import { USER_ROL } from '#types/user_type'
import transporter from "#start/nodemailer";
import { Response } from "@adonisjs/core/http";
import { Session } from "@adonisjs/session";

export default class InvoiceController {

  //! Método para obtener las facturas de un cliente
  public async getClientInvoices(clientId: string) {
    const invoices = await Invoice.query()
      .where('client_id', clientId)
      .select('invoice_id', 'total', 'created_at', 'status', 'tax_total', 'subtotal')
      .orderBy('created_at', 'desc');
    return invoices;
  }

  //! Método para mostrar los datos de la factura en HTML
  public async showInvoiceHTML({ params, response, view, session }: HttpContext) {
    const { invoiceId } = params;

    // Obtener la factura desde la base de datos
    const invoice = await Invoice.query().where('invoice_id', invoiceId).first();

    if (!invoice) {
        console.log(`Invoice with ID ${invoiceId} not found.`);
        return response.status(404).send('Factura no encontrada');
    }
    const USER = await session.get('user'); // Esto obtiene el usuario autenticado

    // Obtener los productos asociados a la factura
    const invoiceProducts = await InvoiceProduct.query().where('invoice_id', invoiceId);

    if (invoiceProducts.length === 0) {
        console.log('No products found for this invoice.');
        return response.status(404).send('No hay productos en esta factura');
    }

    // Generar la parte del cuerpo de la factura (HTML de la factura)
    const invoiceHtmlContent = await this.generateInvoiceHTML(invoice, invoiceProducts);

    // Renderizar el encabezado y pie de página, y luego inyectar el HTML de la factura en medio
    const header = await view.render('partials/header'); // Aquí está el encabezado
    const footer = await view.render('partials/footer'); // Aquí está el pie de página

    // Definir los enlaces a los archivos CSS
    const styles = `
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/header.css">
        <link rel="stylesheet" href="/css/footer.css">
    `;

    // Combinar el contenido
    const fullHtmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura</title>
            ${styles}  <!-- Estilos agregados aquí -->
        </head>
        <body>
            ${header} <!-- El encabezado -->
            <div class="invoice-body">${invoiceHtmlContent}</div> <!-- Cuerpo de la factura -->
            ${footer} <!-- El pie de página -->
        </body>
        </html>
    `;

    // Configurar los headers y enviar la respuesta
    response.header('Content-Type', 'text/html');
    return response.send(fullHtmlContent),{
      USER, 
      USER_ROL
    }; // Enviar el HTML combinado
  }

  //! Método para descargar el PDF de la factura
  public async downloadInvoicePDF({ params, response }: HttpContext) {
    const { invoiceId } = params;

    const invoice = await Invoice.query().where('invoice_id', invoiceId).first();

    if (!invoice) {
      console.log(`Invoice with ID ${invoiceId} not found.`);
      return response.status(404).send('Factura no encontrada');
    }

    const invoiceProducts = await InvoiceProduct.query().where('invoice_id', invoiceId);

    if (invoiceProducts.length === 0) {
      console.log('No products found for this invoice.');
      return response.status(404).send('No hay productos en esta factura');
    }

    const htmlContent = await this.generateInvoiceHTML(invoice, invoiceProducts);

    //* Usar Playwright para generar el PDF
    try {
      const browser = await chromium.launch({ args: ['--no-sandbox'] }); //* Lanzar el navegador
      const context = await browser.newContext();
      const page = await context.newPage();

      //* Cargar el contenido HTML
      await page.setContent(htmlContent, { waitUntil: 'load' });

      //* Generar el PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      //* Configurar los headers de la respuesta
      response.header('Content-Type', 'application/pdf');
      response.header('Content-Disposition', `attachment; filename=invoice_${invoiceId}.pdf`);
      return response.send(pdfBuffer); //* Enviar el archivo PDF
    } catch (error) {
      console.error('Error generating PDF with Playwright:', error);
      return response.status(500).send('Error al generar el PDF');
    }
  }

  private async generateInvoiceHTML(invoice: Invoice, invoiceProducts: InvoiceProduct[]) {
    try {
      //* Obtener la ruta de la plantilla HTML
      const __dirname = path.dirname(new URL(import.meta.url).pathname);
      const templatePath = path.join(__dirname, '..', '..', 'resources', 'views', 'templates', 'invoice_template.edge');
      console.log("Ruta de la plantilla:", templatePath);

      //* Leer el archivo de plantilla
      const template = await fs.promises.readFile(templatePath, 'utf-8');

      //* Generar las filas de productos en la tabla
      const productRows = invoiceProducts.map(product => `
        <tr>
          <td>${product.productName}</td>
          <td>${product.quantity}</td>
          <td>${product.price}€</td>
          <td>${(product.quantity * (product.discountedPrice > 0 ? product.discountedPrice : product.price)).toFixed(2)}€</td>
        </tr>
      `).join('');

      //* Reemplazar las variables de la plantilla con los datos de la factura
      const content = template
        .replace('{{invoiceId}}', invoice.invoiceId.toString())
        .replace('{{createdAt}}', invoice.createdAt.toLocaleString( { year: 'numeric', month: 'long', day: 'numeric' }))
        .replace('{{total}}', invoice.total.toString())
        .replace('{{subtotal}}', invoice.subtotal.toString())
        .replace('{{taxTotal}}', invoice.taxTotal.toString())
        .replace('{{status}}', invoice.status)
        .replace('{{invoiceProducts}}', productRows);

      return content;
    } catch (error) {
      console.error("Error al generar el HTML:", error);
      throw error;
    }
  }

  //! Método enviar al email la factura PDF
  public async sendInvoiceEmail({ params, response, session }: { params: { invoiceId: string }, response: Response, session: Session }) {
    const { invoiceId } = params
    //* Obtener el correo electrónico del usuario autenticado (remitente)
    const userEmail = (await session.get('user'))?.email

    //* Obtener la factura y productos asociados
    const invoice = await Invoice.query().where('invoice_id', invoiceId).first()

    if (!invoice) {
      console.log(`Invoice with ID ${invoiceId} not found.`)
      return response.status(404).send('Factura no encontrada')
    }

    const invoiceProducts = await InvoiceProduct.query().where('invoice_id', invoiceId)

    if (invoiceProducts.length === 0) {
      console.log('No products found for this invoice.')
      return response.status(404).send('No hay productos en esta factura')
    }

    //* Generar el contenido HTML de la factura
    const htmlContent = await this.generateInvoiceHTML(invoice, invoiceProducts)

    //* Generar el PDF de la factura
    let pdfBuffer: Buffer
    try {
      const browser = await chromium.launch({ args: ['--no-sandbox'] })
      const context = await browser.newContext()
      const page = await context.newPage()

      await page.setContent(htmlContent, { waitUntil: 'load' })
      pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })

      await browser.close()
    } catch (error) {
      console.error('Error generating PDF with Playwright:', error)
      return response.status(500).send('Error al generar el PDF')
    }

    if (!userEmail) {
      return response.status(400).send('No se encontró el correo del usuario autenticado.')
    }

    //* Configuración del correo electrónico
    const emailOptions = {
      from: `"Luminaria" <${userEmail}>`, 
      to: userEmail,
      subject: `Factura N° ${invoice.invoiceId}`,
      html: `<p>Estimado/a ${invoice.clientName},</p>
             <p>Adjuntamos la factura N° ${invoice.invoiceId} correspondiente a su compra.</p>
             <p>Gracias por su preferencia.</p>`,
      attachments: [
        {
          filename: `invoice_${invoice.invoiceId}.pdf`,
          content: pdfBuffer,
        },
      ],
    }

    //* Enviar el correo electrónico con el PDF adjunto
    try {
      await transporter.sendMail(emailOptions)
      console.log('Correo enviado con éxito.')
      return response.json({ message: 'Factura enviada por correo con éxito.' })
    } catch (error) {
      console.error('Error sending email:', error)
      return response.status(500).json({ error: 'Error al enviar el correo con la factura.' })
    }
  }
}
