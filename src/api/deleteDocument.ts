import type { DeleteDocumentResponse } from "../types"
import { getStoredSession } from "../lib/auth"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function deleteDocument(documentId: string): Promise<DeleteDocumentResponse> {
    const session = getStoredSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        throw new Error('Login again to delete this document.')
    }

    const response = await fetch(`${API_BASE_URL}/api/documents/delete/${documentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error('Could not delete this document. Login again')
    }

    return response.json()
}