// Función para actualizar el contador del carrito
  async function updateCartCount(totalQuantity) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity || 0;
    }
  }

  // Función para mostrar un mensaje
  function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.style.position = 'fixed';
    messageBox.style.bottom = '20px';
    messageBox.style.right = '20px';
    messageBox.style.padding = '10px';
    messageBox.style.borderRadius = '5px';
    messageBox.style.zIndex = '1000';
    messageBox.style.color = 'white';
    messageBox.style.fontWeight = 'bold';

    if (type === 'success') {
      messageBox.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
      messageBox.style.backgroundColor = '#dc3545';
    }

    document.body.appendChild(messageBox);

    setTimeout(() => {
      messageBox.remove();
    }, 3000);
  }

  // Manejo del evento de enviar el formulario de añadir al carrito
  document.querySelectorAll('.add-to-cart-form, .add-to-cart-form-detail').forEach((form) => {
    form.addEventListener('submit', async function(event) {
      event.preventDefault();  // Prevenir la acción predeterminada del formulario

      const submitButton = this.querySelector('button[type="submit"]');

      // Si el formulario ya se está enviando, evitamos que se vuelva a enviar
      if (submitButton.disabled) return;

      submitButton.disabled = true;  // Deshabilitar el botón temporalmente para evitar clics repetidos

      const formData = new FormData(this);
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      try {
        // Enviar la solicitud al servidor usando fetch API
        const response = await fetch(this.action, {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();  // Obtenemos la respuesta que contiene `totalQuantity`

          if (data.error) {
            showMessage(data.error, 'error');
          } else {
            // Actualizamos el contador en el frontend de manera inmediata
            updateCartCount(data.totalQuantity);
            // Mostrar mensaje de éxito
            showMessage('Producto añadido al carrito', 'success');
          }
        } else {
          showMessage('Hubo un problema al añadir el producto al carrito. Inténtalo de nuevo.', 'error');
        }
      } catch (error) {
        showMessage('Error de red al intentar añadir el producto. Verifica tu conexión.', 'error');
      } finally {
        // Habilitar el botón nuevamente después de procesar la solicitud
        setTimeout(() => {
          submitButton.disabled = false;  // Habilitar el botón
        }, 0); 
      }
    });
  });