export interface TestimonialInterface {
  id: string
  role: string
  name: string
  testimonial: string
  avatar: string
  published?: boolean
}

export interface ExperienceInterface {
  id: string
  role: string
  business: string
  date: string
  description: string[]
  order?: number
  draft?: boolean
}

export interface HeroSocialLink {
  label: string
  url: string
  icon: string
}

export interface HeroContent {
  badge: string
  title: string
  subtitleHtml: string
  image?: string
  socialLinks?: HeroSocialLink[]
}

export interface AboutContent {
  badge: string
  title: string
  bodyHtml: string
}

export type StackCategory = string

export interface StackCategoryInterface {
  id: string
  name: string
  slug: string
  order: number
}

export interface ProjectFilterInterface {
  id: string
  name: string
  slug: string
  order: number
}

export interface StackInterface {
  id: string
  name: string
  icon: string
  darkIcon?: string
  order?: number
  draft?: boolean
  category?: StackCategory
}

export interface ProjectInterface {
  title: string
  slug: string
  mockup: string
  image: string
  stacks?: string[]
  description?: string
  gallery?: string[]
  url?: string | null
  github?: string | null
  draft?: boolean
}