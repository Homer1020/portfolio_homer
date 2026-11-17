import { slugify } from './stackCategories'

export { slugify }

export interface ProjectFilterOption {
  slug: string
  name: string
  order: number
}

export const DEFAULT_PROJECT_FILTERS: ProjectFilterOption[] = [
  { slug: 'php', name: 'PHP', order: 1 },
  { slug: 'laravel', name: 'Laravel', order: 2 },
  { slug: 'javascript', name: 'JavaScript', order: 3 },
  { slug: 'reactjs', name: 'ReactJS', order: 4 },
  { slug: 'wordpress', name: 'Wordpress', order: 5 },
  { slug: 'nodejs', name: 'NodeJS', order: 6 },
]

/** Filtros ordenados. Si no hay filas guardadas usa los defaults. */
export const resolveProjectFilters = (rows: ProjectFilterOption[] = []): ProjectFilterOption[] =>
  [...(rows.length > 0 ? rows : DEFAULT_PROJECT_FILTERS)].sort((a, b) => a.order - b.order)
