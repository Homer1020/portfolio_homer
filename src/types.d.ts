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

interface Option {
  readonly label: string;
  readonly value: string;
}

export interface ProjectValidationErrors {
  title?: string,
  content?: string,
  thumbnail?: string,
  tecnologies?: string,
}