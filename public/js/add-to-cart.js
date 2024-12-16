async function updateCartCount(totalQuantity) {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
      cartCountElement.textContent = totalQuantity || 0;
  }
}

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

document.querySelectorAll('.add-to-cart-form').forEach((form) => {
  form.addEventListener('submit', async function(event) {
      event.preventDefault();  
      const submitButton = this.querySelector('button[type="submit"]');
      const formData = new FormData(this);
      const productId = formData.get('productId');
      const quantityInput = this.querySelector('input[name="quantity"]');

            const availableUnitsForProduct = parseInt(this.dataset.productUnit, 10);

      const requestedQuantity = parseInt(quantityInput.value, 10);

            if (availableUnitsForProduct <= 0) {
          showMessage('Ya no quedan productos disponibles', 'error');
          return;
      }

            if (requestedQuantity > availableUnitsForProduct) {
          showMessage('No hay suficientes unidades disponibles', 'error');
          return;
      }

            if (submitButton.disabled) return;

      submitButton.disabled = true; 
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      try {
                    const response = await fetch(this.action, {
              method: 'POST',
              headers: {
                  'X-CSRF-TOKEN': csrfToken,
              },
              body: formData,
          });

          if (response.ok) {
              const data = await response.json(); 
              if (data.error) {
                  showMessage(data.error, 'error');
              } else {
                                    updateCartCount(data.totalQuantity);

                                    const remainingUnits = availableUnitsForProduct - requestedQuantity;

                                    this.dataset.productUnit = remainingUnits;

                                    if (remainingUnits <= 0) {
                      showMessage('Producto agotado', 'error');
                  }

                                    if (remainingUnits <= 0) {
                      this.querySelector('.add-to-cart-btn').disabled = true;
                  }

                                    showMessage('Producto añadido al carrito', 'success');
              }
          } else {
              showMessage('Hubo un problema al añadir el producto al carrito. Inténtalo de nuevo.', 'error');
          }
      } catch (error) {
          showMessage('Error de red al intentar añadir el producto. Verifica tu conexión.', 'error');
      } finally {
                    submitButton.disabled = false;
      }
  });
});

document.querySelectorAll('.add-to-cart-btn-detail').forEach((button) => {
  button.addEventListener('click', async function(event) {
      event.preventDefault(); 
      const productId = this.dataset.id;
      let availableUnitsForProduct = parseInt(this.dataset.productUnit, 10);

            if (availableUnitsForProduct <= 0) {
                    showMessage('Producto agotado', 'error');
          this.disabled = true;           return;
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      try {
                    const formData = new FormData();
          formData.append('productId', productId);
          formData.append('quantity', 1); 
          const response = await fetch('/cart/add', {
              method: 'POST',
              headers: {
                  'X-CSRF-TOKEN': csrfToken,
              },
              body: formData,
          });

          if (response.ok) {
              const data = await response.json();

              if (data.error) {
                  showMessage(data.error, 'error');
              } else {
                                    updateCartCount(data.totalQuantity);

                                    const remainingUnits = availableUnitsForProduct - 1;

                                    this.dataset.productUnit = remainingUnits;

                                    if (remainingUnits <= 0) {
                      showMessage('Producto agotado', 'error');
                      this.disabled = true;                   }

                  showMessage('Producto añadido al carrito', 'success');
              }
          } else {
              showMessage('Hubo un problema al añadir el producto al carrito. Inténtalo de nuevo.', 'error');
          }
      } catch (error) {
          showMessage('Error de red al intentar añadir el producto. Verifica tu conexión.', 'error');
      }
  });
});
