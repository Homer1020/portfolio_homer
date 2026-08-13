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
}

export interface ProjectInterface {
  title: string
  slug: string
  mockup: string
  image: string
  stacks?: string[]
  description?: string
  url?: string | null
  github?: string | null
}