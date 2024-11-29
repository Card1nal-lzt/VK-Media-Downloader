const axios = require('axios')
const fs = require('fs')
const path = require('path')

const ACCESS_TOKEN = '' // VK API token
const GROUP_ID = -123456678 // Group ID (with minus)
const SAVE_DIR = './vk_media' // Folder for saving files
const API_VERSION = '5.131' // Version API VK

if (!fs.existsSync(SAVE_DIR)) {
	fs.mkdirSync(SAVE_DIR, { recursive: true })
}

async function getWallPosts(ownerId, count = 100, offset = 0) {
	const url = 'https://api.vk.com/method/wall.get'
	try {
		const response = await axios.get(url, {
			params: {
				owner_id: ownerId,
				count,
				offset,
				access_token: ACCESS_TOKEN,
				v: API_VERSION,
			},
		})

		if (response.data.error) {
			throw new Error(response.data.error.error_msg)
		}

		return response.data.response.items
	} catch (error) {
		console.error('Error fetching posts:', error.message)
		return []
	}
}

async function downloadFile(url, filename) {
	try {
		const response = await axios.get(url, { responseType: 'stream' })
		const filePath = path.join(SAVE_DIR, filename)
		const writer = fs.createWriteStream(filePath)

		response.data.pipe(writer)

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve)
			writer.on('error', reject)
		})
	} catch (error) {
		console.error(`Error downloading file ${filename}:`, error.message)
	}
}

async function processAttachments(attachments) {
	for (const attachment of attachments) {
		if (attachment.type === 'photo') {
			const photo = attachment.photo

			if (photo.owner_id === GROUP_ID) {
				const maxPhoto = photo.sizes.reduce((max, current) =>
					max.width > current.width ? max : current
				)
				await downloadFile(maxPhoto.url, `photo_${photo.id}.jpg`)
			}
		} else if (attachment.type === 'doc' && attachment.doc.ext === 'gif') {
			const gif = attachment.doc
			await downloadFile(gif.url, `gif_${gif.id}.gif`)
		}
	}
}

async function processPosts(posts) {
	for (const post of posts) {
		if (post.copy_history) continue

		if (post.attachments) {
			await processAttachments(post.attachments)
		}
	}
}

async function main() {
	let offset = 0
	const count = 100

	console.log('Starting loading from the group...')

	while (true) {
		const posts = await getWallPosts(GROUP_ID, count, offset)
		if (!posts.length) break

		await processPosts(posts)
		offset += count
	}

	console.log('Download complete.')
}

main().catch(error => console.error('Script execution error:', error.message))
