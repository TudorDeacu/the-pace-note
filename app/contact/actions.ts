"use server";

import { resend, getEmailTemplate } from "@/utils/email";

export async function sendContactEmail(name: string, email: string, subject: string, message: string) {
    if (!resend) {
        return { error: "Serviciul de e-mail nu este configurat." };
    }
    if (!name || !email || !subject || !message) {
        return { error: "Toate câmpurile sunt obligatorii." };
    }

    try {
        // Wrap the display name in double quotes for safe header compilation
        const displaySender = `"${name.replace(/"/g, '')}" <newsletter@thepacenote.ro>`;

        const { error } = await resend.emails.send({
            from: displaySender,
            to: ["thepacenote.crew@gmail.com"],
            replyTo: email,
            subject: subject,
            html: getEmailTemplate(
                subject,
                `
                <p style="color: #ffffff; font-size: 15px; margin-bottom: 10px;">
                    <strong>Ai primit un mesaj de la ${name} (${email}):</strong>
                </p>
                <div style="background-color: #1a1a1a; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; color: #e4e4e7; font-family: monospace; font-size: 14px; white-space: pre-wrap; margin-top: 15px; margin-bottom: 15px;">${message}</div>
                <p style="color: #666666; font-size: 13px; margin-top: 20px;">
                    Poți apăsa pe "Răspunde" (Reply) în clientul tău de e-mail pentru a-i scrie înapoi direct lui ${name}.
                </p>
                `
            )
        });

        if (error) {
            console.error("Resend contact form error:", error);
            return { error: "A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou mai târziu." };
        }

        return { success: true };
    } catch (err) {
        console.error("Resend contact form exception:", err);
        return { error: "A apărut o eroare neașteptată." };
    }
}
