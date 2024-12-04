import { HttpContext } from '@adonisjs/core/http'
import Stripe from 'stripe'

export default class PaymentController {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-11-20.acacia',
    })
  }

  public async checkout({ session, response }: HttpContext) {
    const cart = session.get('cart')
    const total = cart ? Object.values(cart).reduce((acc:any, item:any) => acc + (parseFloat(item.discountedPrice) * item.quantity), 0) : 0

    if (!cart || cart.length === 0) {
      return response.status(400).json({ error: 'El carrito está vacío.' }) //* Maneja el error de carrito vacío
    }

    try {
      //! Crear un PaymentIntent para simular el pago
      //! Si se quisiera hacer un pago real, se debe usar Stripe.confirmCardPayment
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Number(total) * 100, //! Monto simulado en centimos que pasaran a euros (ej. 100 = 10.00€)
        currency: 'eur',
        payment_method_types: ['card'],
      })

      return response.json({
        clientSecret: paymentIntent.client_secret, //* Envía el clientSecret para confirmación
      })
    } catch (error) {
      console.error('Error al crear PaymentIntent:', error)
      return response.status(500).json({ error: 'Error al procesar el pago.' })
    }
  }

  public async clearCart({ session, response }: HttpContext) {
    session.forget('cart')
    return response.json({ message: 'Carrito eliminado con éxito.' })
  }
}
