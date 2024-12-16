import { HttpContext } from '@adonisjs/core/http';
import Stripe from 'stripe';
import Invoice from '#models/invoice_model'; // Modelo de factura
import InvoiceProduct from '#models/invoiceProduct_model';
import InvoiceController from './invoice.controller.js';
import Client from '#models/client_model'; // Modelo de clientes
import Product from '#models/product_model';
import { DateTime } from 'luxon';
import { DISCOUNT_TYPE, STATUS } from '#types/invoice_type';
import { CartItem } from './product.controller.js';
import { USER_ROL } from '#types/user_type';

export default class PaymentController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-11-20.acacia',
    });
  }


  public async checkout({ session, response }: HttpContext) {
    try {
      console.log('Iniciando checkout...')
  
      const cart = session.get('cart')
      console.log('Carrito obtenido de la sesión:', cart)
  
      if (!cart || Object.keys(cart).length === 0) {
        console.warn('El carrito está vacío.')
        return response.status(400).json({ error: 'El carrito está vacío.' })
      }
  
      const user = session.get('user')
      console.log('Usuario autenticado:', user)
  
      if (!user) {
        console.warn('Usuario no autenticado.')
        return response.status(401).json({ error: 'Usuario no autenticado.' })
      }
  
      const client = await Client.findBy('user_id', user.userId)
      console.log('Cliente asociado al usuario:', client)
  
      if (!client) {
        console.warn('Cliente no encontrado para el usuario:', user.userId)
        return response.status(404).json({ error: 'Cliente no encontrado.' })
      }
  
      let subtotal = 0
      const taxPercent = 4 //? EL IVA de los productos literarios es del 4% fijo por ley
      console.log('Iniciando cálculos de la factura...')
  
      const invoiceProductsData = await Promise.all(
        Object.values(cart).map(async (item: any) => {
          const quantity = item.quantity || 0
          const price = parseFloat(item.price) || 0
          const discountedPrice = parseFloat(item.discountedPrice) || price
          const productSubtotal = discountedPrice * quantity
  
          //! Verificar stock de los productos
          const product = await Product.find(item.productId)
          if (product && product.unit < quantity) {
            console.warn('Stock insuficiente para el producto:', product.name)
            throw new Error(`No hay suficiente stock para el producto ${product.name}.`)
          }
  
          subtotal += productSubtotal
  
          console.log('Producto procesado:', {
            productId: item.productId,
            productName: item.name,
            quantity,
            price,
            discountedPrice,
            productSubtotal,
          })
  
          return {
            productId: item.productId,
            productName: item.name,
            quantity,
            price: discountedPrice,
            discountedPrice: discountedPrice,
            discount: price - discountedPrice,
            discountType: item.discountType,
            tax: (productSubtotal * taxPercent) / 100,
          }
        })
      )
  
      console.log('Subtotal calculado:', subtotal)
      const taxTotal = (subtotal * taxPercent) / 100
      const total = subtotal - taxTotal
      console.log('Tax total:', taxTotal, 'Total:', total)
  
      //! Crear PaymentIntent con Stripe
      console.log('Creando PaymentIntent con Stripe...')
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'eur',
        payment_method_types: ['card'],
      })
      console.log('PaymentIntent creado:', paymentIntent)
  
      console.log('Creando factura en la base de datos...')
      const invoice = await Invoice.create({
        organizationId: '1',
        clientId: client.clientId,
        clientName: client.fullName,
        currency: 'EUR',
        taxPercent,
        taxName: 'IVA',
        status: STATUS.PAID,
        subtotal,
        taxTotal,
        total,
        nextRecurringAt: DateTime.local(),
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      })
      console.log('Factura creada:', invoice)
  
      console.log('Creando productos relacionados en la factura...')
      await InvoiceProduct.createMany(
        invoiceProductsData.map((product) => ({
          invoiceId: invoice.invoiceId,
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
          discountedPrice: product.discountedPrice,
          discount: product.discount,
          discountType: product.discountType,
          tax: product.tax,
          createdAt: DateTime.local(),
          updatedAt: DateTime.local(),
        }))
      )
      console.log('Productos relacionados creados.')
  
      //* Actualizar stock de los productos
      console.log('Actualizando stock de los productos...')
      await Promise.all(
        Object.values(cart).map(async (item: any) => {
          const product = await Product.find(item.productId)
          if (product) {
            product.unit -= item.quantity
            await product.save()
          }
        })
      )
  
      //* Vaciar el carrito tras el pago exitoso
      console.log('Vaciando el carrito...')
      session.forget('cart')
  
      //* Enviar la factura por correo
      console.log('Enviando factura por correo...')
      await new InvoiceController().sendInvoiceEmail({ params: { invoiceId: invoice.invoiceId }, response, session })
  
      //* Responder con el clientSecret para la confirmación
      return response.json({
        clientSecret: paymentIntent.client_secret,
        message: 'Factura creada y pago iniciado.',
        invoiceId: invoice.invoiceId,
      })
    } catch (error) {
      console.error('Error al procesar el pago o crear la factura:', error)
      return response.status(500).json({
        error: 'Error al procesar el pago.',
        details: error.message || error,
      })
    }
  }

  public async clearCart({ session, response }: HttpContext) {
    try {
      console.log('Limpiando el carrito...');
      session.forget('cart');
      return response.json({ message: 'Carrito eliminado con éxito.' });
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
      return response.status(500).json({ error: 'Error al limpiar el carrito.' });
    }
  }

  public async buyNowPage({ params, view, session, response }: HttpContext) {
    const product = await Product.find(params.productId);
    const finalPrice = product ? product.price - (product.discountType === DISCOUNT_TYPE.PERCENTAGE ? (product.price * product.discount) / 100 : product.discount) : 0;

    const cartData = session.get('cart');
    const cart: CartItem[] = cartData ? Object.values(cartData) : [];

    if (!product) {
        return 'Producto no encontrado'; // Manejo de errores básico
    }

    const user = session.get('user');

    if (!product || product.unit < 1) {
      return response.redirect().toRoute('products.show', { productId: product.productId });
    }
    else{
      return view.render('pages/buy-now', { product, finalPrice, cart, user, USER_ROL });
    }
    
  }

  public async createPaymentIntent({ params, session, response }: HttpContext) {
    try {
      const product = await Product.find(params.productId)

      if (!product) {
        return response.status(404).json({ error: 'Producto no encontrado.' })
      }

      //* Verificar si hay al menos 1 unidad disponible
      if (product.unit < 1) {
        console.warn('Stock insuficiente para el producto:', product.name)
        return response.status(500).json({
          error: 'No quedan productos disponibles.',
        })
      }

      const user = session.get('user')
      if (!user) {
        return response.status(401).json({ error: 'Usuario no autenticado.' })
      }

      const client = await Client.findBy('user_id', user.userId)
      if (!client) {
        return response.status(404).json({ error: 'Cliente no encontrado.' })
      }

      //* Calcular subtotal, impuestos y total
      const discountedPrice = product.discount > 0
        ? product.discountType === 'PERCENTAGE'
          ? product.price * (1 - product.discount / 100)
          : product.price - product.discount
        : product.price

      const taxPercent = 4 //? El porcentaje de IVA por ley es del 4%
      const taxTotal = (discountedPrice * taxPercent) / 100
      const total = discountedPrice

      //* Crear PaymentIntent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(total * 100), //* Convertir a centavos
        currency: 'eur',
        payment_method_types: ['card'],
      })

      //* Crear la factura
      const invoice = await Invoice.create({
        organizationId: '1', //* Suponiendo que todas las facturas pertenecen a una organización específica
        clientId: client.clientId,
        clientName: client.fullName,
        currency: 'EUR',
        taxPercent,
        taxName: 'IVA',
        status: STATUS.PAID,
        subtotal: discountedPrice,
        taxTotal,
        total,
        nextRecurringAt: DateTime.local(),
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      })

      //* Crear los productos relacionados en la factura
      await InvoiceProduct.create({
        invoiceId: invoice.invoiceId,
        productId: product.productId,
        productName: product.name,
        quantity: 1, //* Para esta función, solo un producto
        price: discountedPrice > 0 ? discountedPrice : product.price,
        discountedPrice,
        discount: product.price - discountedPrice,
        discountType: product.discountType as DISCOUNT_TYPE,
        tax: taxTotal,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      })

      //* Restar 1 unidad al stock del producto después del pago exitoso
      product.unit -= 1
      await product.save()

      //! Enviar la factura por correo
      console.log('Enviando factura por correo...')
      await new InvoiceController().sendInvoiceEmail({ params: { invoiceId: invoice.invoiceId }, response, session })

      //! Responder con los datos del PaymentIntent y la factura
      return response.json({
        clientSecret: paymentIntent.client_secret,
        message: 'Factura creada y pago iniciado.',
        invoiceId: invoice.invoiceId,
        total,
      })
    } catch (error) {
      console.error('Error al procesar el pago o crear la factura:', error)
      return response.status(500).json({
        error: 'Error al procesar el pago.',
        details: error.message || error,
      })
    }
  }

}
