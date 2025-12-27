import nodemailer from "nodemailer";

// In a real application, you would use environment variables for these
const SMTP_HOST = process.env.SMTP_HOST || "smtp.ethereal.email";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "test_user";
const SMTP_PASS = process.env.SMTP_PASS || "test_pass";

// Create a transporter using Ethereal email for testing or SMTP for production
// If no env vars are set, this will likely fail or needs a fallback.
// For development, we can just log the code to console if email fails or as a default behavior.
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    console.log(`[MAILER] Sending verification code ${code} to ${email}`);

    try {
        const info = await transporter.sendMail({
            from: '"FieldMax" <no-reply@fieldmax.com>',
            to: email,
            subject: "Verify your email address",
            text: `Your verification code is: ${code}`,
            html: `<b>Your verification code is: ${code}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
        // In development, we can fallback to just logging the code, which we did at the start.
        // We don't want to block registration if email fails in strictly dev environment without SMTP.
    }
};
