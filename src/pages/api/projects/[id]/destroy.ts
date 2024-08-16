import type { APIRoute } from "astro";
import { supabase } from "../../../../config/supabase";
import { destroyImage } from "../../../../utils/helpers";

export const DELETE: APIRoute = async ({ request, params }) => {
    const data = await supabase
        .from('projects')
        .delete()
        .match({ id: params.id})
        .select()

    if(data.data) {
        const { error } = await destroyImage(data.data[0].main_thumbnail)
        if(error) console.log(error)
    }
    return new Response(JSON.stringify(data))
};