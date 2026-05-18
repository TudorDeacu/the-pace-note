"use server";

import { createClient } from "@/utils/supabase/server";

export async function subscribeToNewsletter(email: string) {
    if (!email || !email.includes('@')) {
        return { error: "Adresă de email invalidă." };
    }

    const supabase = await createClient();

    try {
        // Attempt to insert the email into the newsletter_subscribers table
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email });

        if (error) {
            // Check if error is due to unique constraint violation (duplicate email)
            if (error.code === '23505') {
                return { error: "Acest email este deja abonat la newsletter." };
            }
            console.error("Supabase insert error:", error);
            return { error: "A apărut o eroare. Te rugăm să încerci din nou mai târziu." };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Newsletter subscription error:", err);
        return { error: "A apărut o eroare neașteptată." };
    }
}
