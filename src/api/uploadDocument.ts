import type { UploadResponse } from "../types"
import { getStoredSession } from "../lib/auth"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function uploadDocument(file: File): Promise<UploadResponse> {
    const MAX_SIZE_MB = 10

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error('Max file size is 10MB')
    }

    const session = getStoredSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        throw new Error('Login again to upload a document.')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    })

    if(response.status === 413) {
        throw new Error('Max file size is 10MB')
    }

    if (!response.ok) {
        throw new Error('Login again to upload a document.')
    }

    return response.json()
}