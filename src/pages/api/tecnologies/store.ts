import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";

export const POST: APIRoute = async ({ request }) => {
    const fd = await request.formData()
    const data = await supabase
        .from('tecnologies')
        .insert({
          tecnology: fd.get('tecnology'),
        })
        .select()
    return new Response(JSON.stringify(data))
};