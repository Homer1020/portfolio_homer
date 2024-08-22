import type { APIRoute } from "astro"
import { Resend } from "resend"

type Errors = {
  fullname: string[]
  email: string[],
  subject: string[],
  message: string[],
}

export const POST: APIRoute = async ({ request }) => {
  const errors: Errors = {
    fullname: [],
    email: [],
    subject: [],
    message: [],
  } 
  try {
    const data = await request.formData()
    const fullname = data.get('fullname')
    const email = data.get('email')
    const subject = data.get('subject')
    const message = data.get('message')
    
    if(!fullname) {
      errors.fullname.push('El nombre completo es requerido')
    }
    if(!email) {
      errors.email.push('El correo es requerido')
    }
    if(!subject) {
      errors.subject.push('El asunto es requerido')
    }
    if(!message) {
      errors.message.push('El mensaje es requerido')
    }
    const thereIsSomeError = Object.values(errors).some(arr => arr.length)
    if(thereIsSomeError) {
      return new Response(JSON.stringify({
        ok: false,
        errors,
        message: 'Error en el formulario'
      }), {
        status: 400
      })
    }
    const resend = new Resend(import.meta.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'homermoncallo@gmail.com',
      subject: `${subject}`,
      html: `
        <b>Nombre completo</b>: ${fullname}
        <br>
        <b>Correo</b>: ${email}
        <br>
        <b>Asunto</b>: ${subject}
        <br>
        ${message}
      `
    })
  } catch(err) {
    return new Response(JSON.stringify({
      ok: false,
      message: 'Ocurrio un error'
    }), {
      status: 400
    })
  }
  return new Response(JSON.stringify({
    ok: true,
    message: 'Mensaje enviado con éxito'
  }))
}