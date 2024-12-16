function validateForm() {
        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');

    let isValid = true;

        const firstName = document.getElementById('firstName');
    if (firstName.value.trim().length < 3 || firstName.value.trim().length > 50) {
        document.getElementById('firstNameError').innerText = 'El primer nombre debe tener entre 3 y 50 caracteres.';
        isValid = false;
    }

    const lastName = document.getElementById('lastName');
    if (lastName.value && (lastName.value.trim().length < 3 || lastName.value.trim().length > 50)) {
        document.getElementById('lastNameError').innerText = 'El apellido debe tener entre 3 y 50 caracteres.';
        isValid = false;
    }

    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').innerText = 'Por favor, ingresa un email válido.';
        isValid = false;
    }

    const password = document.getElementById('password');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/`~\\-])(?!.*\s).{10,20}$/;
    
    if (!passwordRegex.test(password.value)) {
        document.getElementById('passwordError').innerText =
            'La contraseña debe tener entre 10 y 20 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un carácter especial.';
        isValid = false;
    }    

    const billingAddress = document.getElementById('billingAddress');
    if (billingAddress.value.trim().length < 10 || billingAddress.value.trim().length > 200) {
        document.getElementById('billingAddressError').innerText = 'La dirección de facturación debe tener entre 10 y 200 caracteres.';
        isValid = false;
    }

    return isValid; }