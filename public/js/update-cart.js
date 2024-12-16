// Código JavaScript para manejar la actualización de la cantidad y eliminación de productos
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

window.updateQuantity = async function(productId, change) {
    try {
        const response = await fetch(`/cart/update-quantity/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ change }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la cantidad.');
        }

        const data = await response.json();
        location.reload();  
    } catch (error) {
        console.error('Error:', error);
    }
};

window.removeItem = async function(productId) {
    try {
        const response = await fetch(`/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto.');
        }

        const data = await response.json();
        location.reload();  
    } catch (error) {
        console.error('Error:', error);
    }
};