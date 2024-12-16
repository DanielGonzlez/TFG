document.addEventListener('DOMContentLoaded', function() {
    const stripe = Stripe('pk_test_51QRREIKiQDHrCXs1EuRc1IbxFjslbKvjTE517QrNfScNjdbLD3ckfxXs0SMPNsgGFOyKYz1ZEuOUSlfXx6fc8HmZ00RvItoZum');
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

        const productId = document.getElementById('btn-pagar').getAttribute('data-product-id');

        function showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

        function hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    window.pagar = async function() {
        try {
                        showLoading();

                        const response = await fetch(`/create-payment-intent/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Error al iniciar el pago.');
                return;
            }

                        const { error } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: { card: card },
            });

            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Pago completado con éxito');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error en el pago:', error);
            alert('Hubo un problema al procesar el pago.');
        } finally {
                        hideLoading();
        }
    };

        document.getElementById('btn-pagar').addEventListener('click', pagar);
});
