import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, //! Esta usando el puerto 587 para conexiones seguras (STARTTLS)
  secure: false,
  auth: {
    user: 'equipodeluminaria@gmail.com',
    pass: 'acrf rlvx bmun sqmc ',
  },
});

export default transporter;
