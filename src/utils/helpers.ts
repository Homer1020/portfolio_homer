import { supabase } from "../config/supabase"

export const getProjectImageURL = (path: string): string => {
  return `https://cptqwyxiumlnxciqeena.supabase.co/storage/v1/object/public/${path}`
}

export const uploadImage = async (
  thumbnailName: string,
  thumbnail: File
) => {
  const { data, error } = await supabase
    .storage
    .from('projects')
    .upload(thumbnailName, thumbnail, {
      cacheControl: '3600',
      upsert: false,
    })
  return { data, error }
}

export const destroyImage = async (main_thumbnail: string) => {
  const { error } = await supabase
    .storage
    .from('projects')
    .remove([main_thumbnail.replace('projects/', '')])
  return { error }
}