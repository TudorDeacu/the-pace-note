'use server'

import { createClient } from "@/utils/supabase/server"
import { broadcastNewsletter } from "./newsletter/actions"

export async function submitArticle(data: any) {
    const supabase = await createClient()
    try {
        const { notifySubscribers, ...articleData } = data;
        
        const { error, data: res } = await supabase.from('articles').insert([articleData]).select()
        if (error) {
            console.error("Action error:", error);
            return { error: error.message }
        }

        // Automatic Notification (Option B)
        if (notifySubscribers && res && res.length > 0) {
            const article = res[0];
            const subject = `Articol Nou: ${article.title}`;
            const imageUrl = articleData.content?.image_url;
            const message = `
                <p style="color: #999; line-height: 1.6; font-size: 15px;">
                  Salut [Nume],<br><br>
                  ${articleData.content?.excerpt || 'Avem un nou articol pe blog care credem că te-ar putea interesa. Apasă pe butonul de mai jos pentru a-l citi integral.'}
                </p>
                
                <a href="https://thepacenote.com/blog/${article.slug}" style="display: inline-block; padding: 12px 25px; background-color: #ffffff; color: #000; text-decoration: none; font-weight: bold; margin-top: 20px; font-size: 13px; text-transform: uppercase;">Citește tot articolul</a>
            `;
            // Fire and forget (don't block the UI)
            broadcastNewsletter(subject, message, imageUrl).catch(err => console.error("Broadcast err", err));
        }

        return { success: true, data: res }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateArticle(id: string, data: any) {
    const supabase = await createClient()
    try {
        const { error, data: res } = await supabase.from('articles').update(data).eq('id', id).select()
        if (error) return { error: error.message }
        return { success: true, data: res }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function submitProject(data: any) {
    const supabase = await createClient()
    try {
        const { error, data: res } = await supabase.from('projects').insert([data]).select()
        if (error) return { error: error.message }
        return { success: true, data: res }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function updateProject(id: string, data: any) {
    const supabase = await createClient()
    try {
        const { error, data: res } = await supabase.from('projects').update(data).eq('id', id).select()
        if (error) return { error: error.message }
        return { success: true, data: res }
    } catch (e: any) {
        return { error: e.message }
    }
}
