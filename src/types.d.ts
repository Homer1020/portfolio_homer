export interface TestimonialInterface {
  id: string
  role: string
  name: string
  testimonial: string,
  avatar: string
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