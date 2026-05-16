import type { ShareRequest, ShareResponse, SharedLinkInfo, SharedQueryRequest, QueryResponse } from "../types"
import { getStoredSession } from "../lib/auth"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function createSharedLink(payload: ShareRequest): Promise<ShareResponse> {
    const session = getStoredSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        throw new Error('Login again to share documents.')
    }

    const response = await fetch(`${API_BASE_URL}/api/share`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to create share link.')
    }

    return response.json()
}

export async function getSharedLinkInfo(token: string): Promise<SharedLinkInfo> {
    const response = await fetch(`${API_BASE_URL}/api/share/${token}`)

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Shared link not found.')
    }

    return response.json()
}

export async function askSharedQuestion(token: string, payload: SharedQueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/share/${token}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to get answer.')
    }

    return response.json()
}