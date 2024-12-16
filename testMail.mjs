import nodemailer from 'nodemailer';
async function sendTestEmail() {
  try {
    await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, //! Usa el puerto 587 para conexiones seguras (STARTTLS)
      secure: false,
      auth: {
        user: 'equipodeluminaria@gmail.com',
        pass: 'acrf rlvx bmun sqmc ',
      },
    }).sendMail({
      from: '"Luminaria" <equipodeluminaria@gmail.com>',
      to: 'frikiporexcelencia@gmail.com',
      subject: 'Correo de prueba',
      text: 'Este es un correo de prueba enviado desde Nodemailer.',
    });

    console.log('Correo enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

sendTestEmail();
