"use server";

import { createClient } from "@/utils/supabase/server";
import { resend, SENDER_EMAIL, getEmailTemplate } from "@/utils/email";

export async function subscribeToNewsletter(email: string) {
    if (!email || !email.includes('@')) {
        return { error: "Adresă de email invalidă." };
    }

    const supabase = await createClient();

    try {
        // Attempt to insert the email into the newsletter_subscribers table and get the new ID
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email })
            .select('id')
            .single();

        if (error) {
            // Check if error is due to unique constraint violation (duplicate email)
            if (error.code === '23505') {
                return { error: "Acest email este deja abonat la newsletter." };
            }
            console.error("Supabase insert error:", error);
            return { error: "A apărut o eroare. Te rugăm să încerci din nou mai târziu." };
        }

        // Send a welcome email to the subscriber
        if (resend && data?.id) {
            resend.emails.send({
                from: SENDER_EMAIL,
                to: [email],
                subject: "Bun venit la The Pace Note!",
                html: getEmailTemplate(
                    "Bun venit!",
                    `
                    <p>Salut,</p>
                    <p>Îți mulțumim că te-ai abonat la newsletter-ul The Pace Note! Te vom ține la curent cu cele mai noi articole, proiecte și noutăți din lumea auto și motorsport.</p>
                    <p>Ne bucurăm să te avem alături!</p>
                    `,
                    undefined,
                    data.id
                )
            }).catch(err => console.error("Error sending welcome email:", err));
        }

        return { success: true };
    } catch (err: any) {
        console.error("Newsletter subscription error:", err);
        return { error: "A apărut o eroare neașteptată." };
    }
}

export async function unsubscribeSubscriber(id: string) {
    if (!id) {
        return { error: "Token-ul de dezabonare este invalid sau lipsește." };
    }

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ status: 'unsubscribed' })
            .eq('id', id);

        if (error) {
            console.error("Unsubscribe error:", error);
            return { error: "A apărut o eroare la procesarea solicitării de dezabonare." };
        }

        return { success: true };
    } catch (err) {
        console.error("Unsubscribe exception:", err);
        return { error: "A apărut o eroare neașteptată la dezabonare." };
    }
}

export async function resubscribeSubscriber(id: string) {
    if (!id) {
        return { error: "Token-ul de reactivare este invalid." };
    }

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ status: 'subscribed' })
            .eq('id', id);

        if (error) {
            console.error("Resubscribe error:", error);
            return { error: "A apărut o eroare la reactivarea abonamentului." };
        }

        return { success: true };
    } catch (err) {
        console.error("Resubscribe exception:", err);
        return { error: "A apărut o eroare neașteptată la reactivarea abonamentului." };
    }
}

export async function sendWelcomeEmailForRegistration(email: string, givenName: string) {
    if (!email || !email.includes('@')) {
        return { error: "Adresă de email invalidă." };
    }

    const supabase = await createClient();

    try {
        let subscriberId: string | undefined;

        // Check if the user is already in the newsletter_subscribers table
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            subscriberId = existing.id;
        } else {
            // Insert them to subscribe them to the newsletter
            const { data: inserted, error: insertErr } = await supabase
                .from('newsletter_subscribers')
                .insert({ email, first_name: givenName })
                .select('id')
                .maybeSingle();

            if (!insertErr && inserted) {
                subscriberId = inserted.id;
            }
        }

        // Send the welcome email
        if (resend) {
            const nameToUse = givenName || 'Pasionatule';
            await resend.emails.send({
                from: SENDER_EMAIL,
                to: [email],
                subject: "Bun venit la The Pace Note!",
                html: getEmailTemplate(
                    "Bun venit!",
                    `
                    <p>Salut ${nameToUse},</p>
                    <p>Îți mulțumim că te-ai înregistrat și te-ai alăturat comunității The Pace Note! Te vom ține la curent cu cele mai noi articole, proiecte și noutăți din lumea auto și motorsport.</p>
                    <p>Ne bucurăm să te avem alături!</p>
                    `,
                    undefined,
                    subscriberId
                )
            });
        }

        return { success: true };
    } catch (err) {
        console.error("Error sending welcome email for registration:", err);
        return { error: "A apărut o eroare la trimiterea e-mailului de bun venit." };
    }
}
