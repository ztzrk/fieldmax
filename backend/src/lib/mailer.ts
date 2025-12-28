import nodemailer from "nodemailer";

const { SMTP_USER, SMTP_PASS } = process.env;

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});


export const sendVerificationEmail = async (email: string, code: string) => {

    const message = {
        from: '"FieldMax" <no-reply@fieldmax.com>',
        to: email,
        subject: "Verify your email address",
        text: `Your verification code is: ${code}`,
        html: `<b>Your verification code is: ${code}</b>`,
    }
    try {
        await transporter.sendMail(message);
    } finally {
        transporter.close();
    }

};
