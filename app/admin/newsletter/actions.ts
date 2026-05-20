"use server";

import { createClient } from "@/utils/supabase/server";
import { resend, SENDER_EMAIL, getEmailTemplate } from "@/utils/email";

export async function broadcastNewsletter(subject: string, messageHtml: string, imageUrl?: string) {
    if (!resend) {
        return { error: "Resend API key nu este configurat. Verifică fișierul .env.local" };
    }

    if (!subject || !messageHtml) {
        return { error: "Subiectul și mesajul sunt obligatorii." };
    }

    const supabase = await createClient();

    try {
        // Fetch all subscribed users
        const { data: subscribers, error: dbError } = await supabase
            .from('newsletter_subscribers')
            .select('email, first_name')
            .eq('status', 'subscribed');

        if (dbError) {
            console.error("Eroare la obținerea abonaților:", dbError);
            return { error: "Nu am putut prelua lista de abonați din baza de date." };
        }

        if (!subscribers || subscribers.length === 0) {
            return { error: "Nu există niciun abonat activ." };
        }

        // Prepare the batch of emails
        // Resend batch API limit is up to 100 emails per request. For huge lists, we would chunk them.
        const BATCH_LIMIT = 100;
        let successCount = 0;

        for (let i = 0; i < subscribers.length; i += BATCH_LIMIT) {
            const chunk = subscribers.slice(i, i + BATCH_LIMIT);
            
            const emailsToSend = chunk.map(sub => {
                // Personalize the message
                const personalizedMessage = messageHtml.replace(/\[Nume\]/g, sub.first_name || 'Pasionatule');
                
                return {
                    from: SENDER_EMAIL,
                    to: [sub.email],
                    subject: subject,
                    html: getEmailTemplate(subject, personalizedMessage, imageUrl),
                };
            });

            const { data, error } = await resend.batch.send(emailsToSend);

            if (error) {
                console.error("Resend batch error:", error);
                // We don't stop the loop, just log it. In a robust system we'd track failed deliveries.
            } else {
                successCount += emailsToSend.length;
            }
        }

        return { success: true, count: successCount };

    } catch (err) {
        console.error("Newsletter broadcast exception:", err);
        return { error: "A apărut o eroare neașteptată în timpul trimiterii." };
    }
}
