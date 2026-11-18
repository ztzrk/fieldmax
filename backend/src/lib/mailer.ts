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

export const sendReportReplyEmail = async (
    email: string,
    fullName: string,
    reportId: string,
    subject: string,
    replyMessage: string
) => {
    const reportLink = `${config.FRONTEND_URL}/reports/${reportId}`;
    const shortId = reportId.slice(0, 8);

    const message = {
        from: config.SMTP_FROM,
        to: email,
        subject: `[FieldMax Bantuan #${shortId}] Balasan baru: ${subject}`,
        text: `Halo ${fullName},\n\nTim dukungan FieldMax telah membalas laporan Anda (#${shortId} - ${subject}):\n\n"${replyMessage}"\n\nLihat detail laporan di: ${reportLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h3>Balasan Baru untuk Tiket Bantuan #${shortId}</h3>
                <p>Halo <strong>${fullName}</strong>,</p>
                <p>Tim dukungan FieldMax telah membalas laporan Anda berjudul <strong>${subject}</strong>:</p>
                <blockquote style="border-left: 4px solid #2563eb; padding-left: 12px; margin: 16px 0; color: #374151;">
                    ${replyMessage.replace(/\n/g, "<br/>")}
                </blockquote>
                <p>
                    <a href="${reportLink}" style="display: inline-block; padding: 10px 18px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Lihat Percakapan
                    </a>
                </p>
            </div>
        `,
    };
    await transporter.sendMail(message);
};

export const sendReportResolvedEmail = async (
    email: string,
    fullName: string,
    reportId: string,
    subject: string
) => {
    const reportLink = `${config.FRONTEND_URL}/reports/${reportId}`;
    const shortId = reportId.slice(0, 8);

    const message = {
        from: config.SMTP_FROM,
        to: email,
        subject: `[FieldMax Bantuan #${shortId}] Laporan selesai: ${subject}`,
        text: `Halo ${fullName},\n\nLaporan Anda (#${shortId} - ${subject}) telah ditandai selesai oleh tim dukungan FieldMax.\n\nLihat riwayat laporan di: ${reportLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h3>Tiket Bantuan #${shortId} Telah Diselesaikan</h3>
                <p>Halo <strong>${fullName}</strong>,</p>
                <p>Laporan Anda berjudul <strong>${subject}</strong> telah ditandai selesai oleh tim dukungan FieldMax.</p>
                <p>
                    <a href="${reportLink}" style="display: inline-block; padding: 10px 18px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        Lihat Detail Laporan
                    </a>
                </p>
            </div>
        `,
    };
    await transporter.sendMail(message);
};
