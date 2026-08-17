import type { APIRoute } from 'astro'
import { serverAuth } from '../../../config/firebase-server'

export const POST: APIRoute = async ({ request, cookies }) => {
	const sessionCookie = cookies.get('__session')?.value

	if (!sessionCookie) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		await serverAuth.verifySessionCookie(sessionCookie, true)
	} catch {
		return new Response('Unauthorized', { status: 401 })
	}

	const formData = await request.formData()
	const file = formData.get('file')

	if (!(file instanceof File) || file.size === 0) {
		return new Response('No se envió ningún archivo', { status: 400 })
	}

	if (!file.type.startsWith('image/')) {
		return new Response('El archivo debe ser una imagen', { status: 400 })
	}

	if (file.size > 5e6) {
		return new Response('El archivo debe pesar 5mb o menos', { status: 400 })
	}

	try {
		const ext = file.name.split('.').pop() || 'jpg'
		const slug = formData.get('slug')
		const field = formData.get('field')
		const isCoverField = typeof slug === 'string' && slug.trim() !== '' && (field === 'mockup' || field === 'image')

		const fileName = isCoverField
			? `${slug}-${field}.${ext}`
			: `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

		const imageKitFormData = new FormData()
		imageKitFormData.append('file', file, fileName)
		imageKitFormData.append('fileName', fileName)
		imageKitFormData.append('folder', 'projects')
		imageKitFormData.append('useUniqueFileName', 'false')
		if (isCoverField) imageKitFormData.append('overwriteFile', 'true')

		const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(import.meta.env.PUBLIC_IMAGE_KIT_PRIVATE_KEY + ':').toString('base64'),
			},
			body: imageKitFormData,
		})

		if (!uploadRes.ok) throw new Error('Error al subir la imagen a ImageKit')

		const uploadData = await uploadRes.json()

		return new Response(JSON.stringify({ url: uploadData.url }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.log({ error })
		return new Response('Error al subir la imagen', { status: 500 })
	}
}
