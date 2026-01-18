const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('[E-MAIL] Credentials missing in .env. E-mail not sent.');
      return false;
    }

    //transport for the e-mail account used by the API (generic SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', //true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"TravelShare App" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[E-MAIL] Message sent: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error('[E-MAIL] Error sending e-mail: ', error);
    return false;
  }
};

module.exports = { sendEmail };

