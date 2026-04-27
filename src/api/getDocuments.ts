import { getStoredSession } from '../lib/auth'
import type { DocumentListResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function getDocuments(): Promise<DocumentListResponse> {
    const session = getStoredSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        throw new Error('Login again to view your documents.')
    }

    const name = session?.displayName

    const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error('Login again to view your documents.')
    }
    
    const res={
        name:name,
        documents: (await response.json()).documents
    }
    return res;
}