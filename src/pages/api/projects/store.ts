import type { APIRoute } from "astro";
import { supabase } from "../../../config/supabase";
import { uploadImage } from "../../../utils/helpers";

export const POST: APIRoute = async ({ request }) => {
    const fd = await request.formData()
    const formErrors: {
        title?: string,
        content?: string,
        thumbnail?: string,
        tecnologies?: string,
    } = {}

    const thumbnail = fd.get('thumbnail') as File
    const thumbnailExtension = thumbnail.name.split('.').reverse()[0]
    const validExtensions = ['png', 'jpg', 'jpeg']

    if(!fd.get('title')) formErrors.title = 'El titulo es requerido.'
    if(!fd.get('content')) formErrors.content = 'El contenido es requerido.'
    if(!fd.get('tecnologies')) formErrors.tecnologies = 'Las tecnologias son requeridas'
    if(!thumbnail) formErrors.thumbnail = 'La imagen es requerido.'
    if(!thumbnail.name) formErrors.thumbnail = 'La imagen no es un valida.'
    if(!validExtensions.includes(thumbnailExtension)) formErrors.thumbnail = 'La imagen debe ser png, jpg o jpeg.'

    if(Object.keys(formErrors).length) {
        return new Response(JSON.stringify({
            ok: false,
            formErrors
        }), {
            status: 400
        });
    }

    const projectSlug = fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-')
    const thumbnailName = `${ fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-') }.${ thumbnailExtension }`
    const { data: uploadData, error: uploadError } = await uploadImage(thumbnailName, fd.get('thumbnail') as File)

    if(uploadError) {
        return new Response(JSON.stringify({
            ok: false,
            message: uploadError.message
        }), {
            status: 400
        })
    }

    const { data, error } = await supabase
        .from('projects')
        .insert({
            main_thumbnail: uploadData?.fullPath,
            title: fd.get('title'),
            content: fd.get('content'),
            slug: projectSlug
        })
        .select()

    if(error) {
        return new Response(JSON.stringify({
            ok: false,
            error
        }), {
            status: 400
        })
    }

    if(data) {
        fd.getAll('tecnologies').forEach(async tecnology => {
            await supabase.from('project_tecnology').insert({
                tecnology_id: tecnology,
                project_id: data[0].id
            })
        })
    }

    return new Response(JSON.stringify({
        ok: true,
        data
    }))
};