'use server'

import { createClient } from "@/utils/supabase/server"

export async function submitArticle(data: any) {
    const supabase = await createClient()
    try {
        const { error, data: res } = await supabase.from('articles').insert([data]).select()
        if (error) {
            console.error("Action error:", error);
            return { error: error.message }
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
