export interface TestimonialInterface {
  id: string
  role: string
  name: string
  testimonial: string,
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

export interface HeroContent {
  badge: string
  title: string
  subtitleHtml: string
}

export interface AboutContent {
  badge: string
  title: string
  bodyHtml: string
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