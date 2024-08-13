import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";

export const DELETE: APIRoute = async ({ request }) => {
    const fd = await request.formData()
    const data = await supabase
        .from('projects')
        .delete()
        .match({ id: fd.get('id') })
        .select()

    if(data.data) {
        const { error } = await supabase
            .storage
            .from('projects')
            .remove([data.data[0].main_thumbnail.replace('projects/', '')])
        console.log(data.data[0].main_thumbnail.replace('projects/', ''))
    }
    return new Response(JSON.stringify(data))
};