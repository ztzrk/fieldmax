import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    const message = {
        from: config.SMTP_FROM,
        to: email,
        subject: "Verify your email address",
        text: `Your verification code is: ${code}`,
        html: `<b>Your verification code is: ${code}</b>`,
    };
    await transporter.sendMail(message);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;

    const message = {
        from: config.SMTP_FROM,
        to: email,
        subject: "Reset your password",
        text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        html: `
            <h3>Reset your password</h3>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };
    console.log(`[MAILER] Sending password reset email to: ${email}`);
    await transporter.sendMail(message);
};
