import type { APIRoute } from 'astro'
import { serverAuth } from '../../../config/firebase-server'

const normalizeImageKitFileName = (value: string | null, fallbackExt: string) => {
	if (!value) return null

	const safeValue = value.trim()
	if (!safeValue) return null

	const cleanValue = safeValue.split('?')[0].split('#')[0]
	const fileName = cleanValue.substring(cleanValue.lastIndexOf('/') + 1) || cleanValue
	const decoded = decodeURIComponent(fileName)

	return decoded.includes('.') ? decoded : `${decoded}.${fallbackExt}`
}

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
	const folder = (formData.get('folder') as string) || 'general'
	const customFileName = formData.get('fileName') as string | null
	const overwriteFile = formData.get('overwriteFile') === 'true' || formData.get('overwriteFile') === '1'

	if (!(file instanceof File) || file.size === 0) {
		return new Response('No se envió ningún archivo', { status: 400 })
	}

	const isImage = file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.name.endsWith('.svg')
	if (!isImage) {
		return new Response('El archivo debe ser una imagen válida (PNG, JPG, SVG, WebP)', { status: 400 })
	}

	if (file.size > 5e6) {
		return new Response('El archivo debe pesar 5mb o menos', { status: 400 })
	}

	try {
		const ext = file.name.split('.').pop() || 'png'
		const fileName = normalizeImageKitFileName(customFileName, ext)
			|| `${folder}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

		const imageKitFormData = new FormData()
		imageKitFormData.append('file', file, fileName)
		imageKitFormData.append('fileName', fileName)
		imageKitFormData.append('folder', folder)
		imageKitFormData.append('useUniqueFileName', overwriteFile ? 'false' : 'true')
		if (overwriteFile) imageKitFormData.append('overwriteFile', 'true')

		const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(import.meta.env.PUBLIC_IMAGE_KIT_PRIVATE_KEY + ':').toString('base64'),
			},
			body: imageKitFormData,
		})

		if (!uploadRes.ok) {
			const errText = await uploadRes.text()
			console.error('ImageKit error:', errText)
			throw new Error('Error al subir la imagen a ImageKit')
		}

		const uploadData = await uploadRes.json()

		return new Response(JSON.stringify({ url: uploadData.url }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error({ error })
		return new Response('Error al subir la imagen', { status: 500 })
	}
}
