import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";

export const POST: APIRoute = async ({ request }) => {
    const fd = await request.formData()
    const data = await supabase
        .from('projects')
        .insert({
            title: fd.get('title'),
            content: fd.get('content'),
            slug: fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-')
        })
        .select()
    if(data.data) {
        fd.getAll('tecnologies').forEach(async tecnology => {
            await supabase.from('project_tecnology').insert({
                tecnology_id: tecnology,
                project_id: data.data[0].id
            })
        })
    }
    return new Response(JSON.stringify(data))
};