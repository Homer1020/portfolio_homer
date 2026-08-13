import type { APIRoute } from 'astro'
import { FieldValue } from 'firebase-admin/firestore'
import { serverAuth, db } from '../../../config/firebase-server'

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

	if (file.type !== 'application/pdf') {
		return new Response('El archivo debe ser un PDF', { status: 400 })
	}

	if (file.size > 10e6) {
		return new Response('El archivo debe pesar 10mb o menos', { status: 400 })
	}

	try {
		const fileName = `cv-${Date.now()}.pdf`

		const imageKitFormData = new FormData()
		imageKitFormData.append('file', file, fileName)
		imageKitFormData.append('fileName', fileName)
		imageKitFormData.append('folder', 'landing')
		imageKitFormData.append('useUniqueFileName', 'false')

		const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(import.meta.env.PUBLIC_IMAGE_KIT_PRIVATE_KEY + ':').toString('base64'),
			},
			body: imageKitFormData,
		})

		if (!uploadRes.ok) throw new Error('Error al subir el archivo a ImageKit')

		const uploadData = await uploadRes.json()

		await db.collection('landing').doc('content').set({
			cvUrl: uploadData.url,
			cvFileName: file.name,
			cvUpdatedAt: FieldValue.serverTimestamp(),
		}, { merge: true })

		return new Response(JSON.stringify({ url: uploadData.url }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.log({ error })
		return new Response('Error al subir el CV', { status: 500 })
	}
}
