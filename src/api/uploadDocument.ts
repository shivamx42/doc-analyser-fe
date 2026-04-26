import type { UploadResponse } from "../types"
import { getStoredSession } from "../lib/auth"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function uploadDocument(file: File): Promise<UploadResponse> {
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

    if (!response.ok) {
        throw new Error('Login again to upload a document.')
    }

    return response.json()
}
