import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";

export const POST: APIRoute = async ({ request }) => {
    const fd = await request.formData()
    const data = await supabase
        .from('projects')
        .insert({
            title: fd.get('title'),
            content: fd.get('content'),
            slug: fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-'),
            category_id: 1
        })
        .select(`*, tecnologies(id, tecnology)`)
    return new Response(JSON.stringify(data))
};