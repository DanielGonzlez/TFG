document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('productoForm');

    form.addEventListener('submit', function(event) {
        let isValid = true;

        // Limpiar mensajes de error previos
        document.querySelectorAll('.error-message').forEach((el) => el.textContent = '');

        // Validación del nombre
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            document.getElementById('nameError').textContent = 'El nombre es obligatorio.';
            isValid = false;
        } else if (name.value.trim().length > 150) {
            document.getElementById('nameError').textContent = 'El nombre no puede exceder los 150 caracteres.';
            isValid = false;
        }

        // Validación del autor
        const author = document.getElementById('author');
        if (!author.value.trim()) {
            document.getElementById('authorError').textContent = 'El autor es obligatorio.';
            isValid = false;
        } else if (author.value.trim().length < 10) {
            document.getElementById('authorError').textContent = 'El autor debe tener al menos 10 caracteres.';
            isValid = false;
        } else if (author.value.trim().length > 50) {
            document.getElementById('authorError').textContent = 'El autor no puede exceder los 50 caracteres.';
            isValid = false;
        }

        // Validación de descripción
        const description = document.getElementById('description');
        if (!description.value.trim()) {
            document.getElementById('descriptionError').textContent = 'La descripción es obligatoria.';
            isValid = false;
        } else if (description.value.trim().length < 10) {
            document.getElementById('descriptionError').textContent = 'La descripción debe tener al menos 10 caracteres.';
            isValid = false;
        } else if (description.value.trim().length > 2500) {
            document.getElementById('descriptionError').textContent = 'La descripción no puede exceder los 2500 caracteres.';
            isValid = false;
        }

        // Validación del precio
        const price = document.getElementById('price');
        if (!price.value || price.value <= 0) {
            document.getElementById('priceError').textContent = 'El precio debe ser mayor a 0.';
            isValid = false;
        }

        // Validación de unidades
        const unit = document.getElementById('unit');
        if (!unit.value || unit.value <= 0) {
            document.getElementById('unitError').textContent = 'Las unidades deben ser mayores a 0.';
            isValid = false;
        }

        // Validación de descuento según tipo
        const discount = document.getElementById('discount');
        const discountType = document.querySelector('select[name="discountType"]').value;

        // Validación para "descuento fijo"
        if (discountType === 'fixed') {
            if (discount.value < 0 || discount.value > 250) {
                document.getElementById('discountError').textContent = 'El descuento fijo debe ser entre 0 y 250.';
                isValid = false;
            }
        }

        // Validación para "descuento porcentual"
        else if (discountType === 'percentage') {
            if (discount.value < 0 || discount.value > 100) {
                document.getElementById('discountError').textContent = 'El descuento porcentual debe ser entre 0 y 100.';
                isValid = false;
            }
        }

        // Validación de imagen
        const image = document.getElementById('image');
        if (image.files.length > 0) {
            const file = image.files[0];
            const validExtnames = ['jpg', 'jpeg', 'png'];
            const fileExtname = file.name.split('.').pop().toLowerCase();
            if (!validExtnames.includes(fileExtname)) {
                document.getElementById('imageError').textContent = 'La imagen debe ser de tipo JPG, JPEG o PNG.';
                isValid = false;
            } else if (file.size > 2 * 1024 * 1024) { // 2MB
                document.getElementById('imageError').textContent = 'La imagen no debe exceder los 2MB.';
                isValid = false;
            }
        }

        if (!isValid) {
            event.preventDefault();  // Detener el envío del formulario si hay errores
        }
    });
});