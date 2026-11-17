import type { APIRoute } from 'astro'
import { serverAuth } from '../../../config/firebase-server'

const getImageKitAuthHeader = () => ({
	Authorization: 'Basic ' + Buffer.from(import.meta.env.PUBLIC_IMAGE_KIT_PRIVATE_KEY + ':').toString('base64'),
})

const resolveFileData = (url?: string | null, fileId?: string | null, filePath?: string | null) => {
	const normalizedUrl = url ? decodeURIComponent(url.split('?')[0].split('#')[0]) : ''
	const pathname = normalizedUrl ? new URL(normalizedUrl).pathname : (filePath ?? '')
	const normalizedPath = (filePath ?? pathname ?? '').trim()
	const fileName = normalizedPath ? normalizedPath.split('/').filter(Boolean).pop() ?? '' : ''

	return {
		fileId: fileId ?? '',
		filePath: normalizedPath,
		fileName,
	}
}

const getFileIdFromImageKit = async (fileName: string, filePath?: string) => {
	const searchQueries = [
		fileName,
		filePath ? filePath.replace(/^\//, '') : '',
		filePath ? filePath : '',
	].filter(Boolean)

	for (const search of searchQueries) {
		try {
			const res = await fetch(`https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(search)}&limit=10`, {
				headers: getImageKitAuthHeader(),
			})
			if (!res.ok) continue

			const json = await res.json()
			const items = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : Array.isArray(json.data) ? json.data : [])
			const match = items.find((item: any) => {
				const itemName = (item?.name ?? '').toString()
				const itemPath = (item?.filePath ?? item?.path ?? '').toString()
				return itemName === fileName || itemPath === filePath || itemPath.endsWith(`/${fileName}`)
			})
			if (match?.fileId) return match.fileId
		} catch (error) {
			console.error('ImageKit search error:', error)
		}
	}

	return null
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

	let payload: { url?: string; fileId?: string; filePath?: string } = {}
	try {
		payload = await request.json()
	} catch {
		return new Response('Payload inválido', { status: 400 })
	}

	const { url, fileId, filePath } = payload
	if (!url && !fileId && !filePath) {
		return new Response('Se requiere url, fileId o filePath', { status: 400 })
	}

	const { filePath: normalizedFilePath, fileName } = resolveFileData(url, fileId, filePath)
	const effectiveFileId = fileId || (fileName ? await getFileIdFromImageKit(fileName, normalizedFilePath) : null)

	const deleteTargets = [] as string[]
	if (effectiveFileId) deleteTargets.push(`https://api.imagekit.io/v1/files/${encodeURIComponent(effectiveFileId)}`)
	if (normalizedFilePath) deleteTargets.push(`https://api.imagekit.io/v1/files?filePath=${encodeURIComponent(normalizedFilePath)}`)
	if (fileName) deleteTargets.push(`https://api.imagekit.io/v1/files?name=${encodeURIComponent(fileName)}`)

	for (const deleteUrl of Array.from(new Set(deleteTargets))) {
		try {
			const res = await fetch(deleteUrl, {
				method: 'DELETE',
				headers: getImageKitAuthHeader(),
			})
			if (res.ok) {
				return new Response(JSON.stringify({ ok: true }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			}
		} catch (error) {
			console.error('ImageKit delete error:', error)
		}
	}

	return new Response('No se pudo eliminar la imagen de ImageKit', { status: 500 })
}
