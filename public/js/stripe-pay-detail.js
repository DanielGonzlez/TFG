async function comprarDirecto(productId) {
    try {
      const response = await fetch('/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Error al iniciar el pago.');
        return;
      }
  
      const stripe = Stripe('pk_test_51QRREIKiQDHrCXs1EuRc1IbxFjslbKvjTE517QrNfScNjdbLD3ckfxXs0SMPNsgGFOyKYz1ZEuOUSlfXx6fc8HmZ00RvItoZum');
      const { error } = await stripe.confirmCardPayment(data.clientSecret);
  
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Pago completado con éxito');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en la compra directa:', error);
      alert('Hubo un problema al procesar la compra.');
    }
  }