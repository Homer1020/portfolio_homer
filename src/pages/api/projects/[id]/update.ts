import type { APIRoute } from "astro"
import { supabase } from "../../../../config/supabase";
import { destroyImage, uploadImage } from "../../../../utils/helpers";

export const PUT: APIRoute = async ({ request, params }) => {
  const fd = await request.formData()

  const projectSlug = fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-')
  const thumbnail = fd.get('thumbnail') as File
  let thumbnailPath = fd.get('current_thumbnail_path');

  if (thumbnail) {
    const currentThumbnailPath = fd.get('current_thumbnail_path')
    if(currentThumbnailPath)  await destroyImage(currentThumbnailPath.toString())
    const thumbnailExtension = thumbnail.name.split('.').reverse()[0]
    const thumbnailName = `${fd.get('title')?.toString().toLowerCase().replaceAll(' ', '-')}.${thumbnailExtension}`
    const { data: uploadData } = await uploadImage(thumbnailName, fd.get('thumbnail') as File)
    if(uploadData) {
      thumbnailPath = uploadData?.fullPath
    }
  }

  const data = await supabase
    .from('projects')
    .update({
      title: fd.get('title'),
      content: fd.get('content'),
      slug: projectSlug,
      main_thumbnail: thumbnailPath
    })
    .eq('id', params.id)
    .select(`
      *,
      project_tecnology(*)
    `)

  console.log(data)
  console.log(params.id)
  
  if (data.data) {
    data.data[0].project_tecnology.forEach(async (pt: {id: number}) => {
      await supabase.from('project_tecnology').delete().match({id: pt.id})
    })
    fd.getAll('tecnologies').forEach(async tecnology => {
      await supabase.from('project_tecnology').insert({
        tecnology_id: tecnology,
        project_id: data.data[0].id
      })
    })
  }
  return new Response(JSON.stringify(data))
};