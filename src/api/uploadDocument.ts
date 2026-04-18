import type { UploadResponse } from "../types"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail)
    }

    return response.json()
}