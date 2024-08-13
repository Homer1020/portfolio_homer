export type ProjectType = {
  title: string
  content: string
  category_id: number
  created_at: string
  slug: string
  id: number
  main_thumbnail: string
  tecnologies: Array<{
    id: number,
    tecnology: string
  }>
}