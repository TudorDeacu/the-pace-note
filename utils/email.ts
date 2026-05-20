import { Resend } from 'resend';

// Initialize the Resend client. Ensure RESEND_API_KEY is in .env.local
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The default sender email for The Pace Note
export const SENDER_EMAIL = "The Pace Note <newsletter@thepacenote.com>"; // Replace with your verified domain!

/**
 * Base HTML Email Template wrapper for The Pace Note branding.
 */
export function getEmailTemplate(title: string, bodyContent: string, imageUrl?: string) {
    const heroImageHtml = imageUrl 
        ? `<img src="${imageUrl}" width="100%" style="display: block; border-top-left-radius: 4px; border-top-right-radius: 4px;">`
        : '';

    // Fallback logo URL (can be replaced with actual hosted logo URL later)
    const logoUrl = "https://thepacenote.com/images/logo.png"; // Replace with your actual logo URL

    return `
    <!DOCTYPE html>
    <html lang="ro">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; font-family: Arial, sans-serif; color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 15px;">
              <!-- LOGO -->
              <img src="https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/logo.jpeg" alt="The Pace Note" width="180" style="display: block; border: 0; margin-bottom: 40px;">
              
              <div style="max-width: 600px; width: 100%; text-align: left; background-color: #111; border: 1px solid #222; border-radius: 4px;">
                ${heroImageHtml}
                
                <div style="padding: 30px;">
                  <h1 style="font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; color: #ffffff;">${title}</h1>
                  <div style="color: #999; line-height: 1.6; font-size: 15px;">
                    ${bodyContent}
                  </div>
                </div>
              </div>
              
              <p style="color: #444; font-size: 11px; margin-top: 30px; text-align: center;">
                Primești acest mail pentru că ești membru al comunității The Pace Note.<br>
                <a href="https://thepacenote.com" style="color: #666; text-decoration: underline;">Dezabonare</a>
              </p>
            </td>
          </tr>
        </table>
    </body>
    </html>
    `;
}
