export interface StackCategoryOption {
  slug: string
  name: string
  order: number
}

export const UNCATEGORIZED_SLUG = 'uncategorized'

export const UNCATEGORIZED: StackCategoryOption = {
  slug: UNCATEGORIZED_SLUG,
  name: 'Otros',
  order: Number.MAX_SAFE_INTEGER,
}

export const DEFAULT_STACK_CATEGORIES: StackCategoryOption[] = [
  { slug: 'backend', name: 'Backend', order: 1 },
  { slug: 'frontend', name: 'Frontend', order: 2 },
  { slug: 'cms', name: 'CMS', order: 3 },
  { slug: 'database', name: 'Databases', order: 4 },
  { slug: 'tools', name: 'Tools', order: 5 },
  { slug: 'mobile', name: 'Mobile', order: 6 },
]

/** Categorías ordenadas + "Otros" al final. Si no hay filas usa los defaults. */
export const resolveStackCategories = (rows: StackCategoryOption[] = []): StackCategoryOption[] => {
  const base = rows.length > 0 ? rows : DEFAULT_STACK_CATEGORIES
  return [
    ...base.filter(c => c.slug !== UNCATEGORIZED_SLUG).sort((a, b) => a.order - b.order),
    UNCATEGORIZED,
  ]
}

/** Devuelve el slug si existe en la lista; si no, 'uncategorized'. */
export const normalizeStackCategory = (value: unknown, categories: StackCategoryOption[]): string =>
  typeof value === 'string' && categories.some(c => c.slug === value) ? value : UNCATEGORIZED_SLUG

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
