document.addEventListener('DOMContentLoaded', function() {
    const stripe = Stripe('pk_test_51QRREIKiQDHrCXs1EuRc1IbxFjslbKvjTE517QrNfScNjdbLD3ckfxXs0SMPNsgGFOyKYz1ZEuOUSlfXx6fc8HmZ00RvItoZum');
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    window.pagar = async function() {
      try {
        // Llamar al endpoint para crear el PaymentIntent
        const response = await fetch('/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        });

        const text = await response.text();
        let clientSecret;
        try {
          const data = JSON.parse(text); 
          clientSecret = data.clientSecret;
        } catch (error) {
          alert('Hubo un error al procesar la respuesta del servidor');
          return;
        }

        // Confirmar el pago con Stripe
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: card },
        });

        if (error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('Pago simulado completado con éxito');

          const response = await fetch('/clear-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),  // Esto es el token
            },
            });

          window.location.href = '/'; // Redirige al home
        }
      } catch (error) {
        console.error('Error al realizar la acción:', error);
        alert('Hubo un error al procesar la acción');
      }
    };
  });