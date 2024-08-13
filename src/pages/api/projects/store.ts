import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";

export const POST: APIRoute = async ({ request }) => {
    const fd = await request.formData()

    const thumbnail = fd.get('thumbnail') as File
    const thumbnailExtension = thumbnail.name.split('.').reverse()[0]
    const projectSlug = fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-')
    const thumbnailName = `${ fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-') }.${ thumbnailExtension }`

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('projects')
        .upload(thumbnailName, thumbnail, {
            cacheControl: '3600',
            upsert: false,
        })

    const data = await supabase
        .from('projects')
        .insert({
            main_thumbnail: uploadData?.fullPath,
            title: fd.get('title'),
            content: fd.get('content'),
            slug: projectSlug
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