import type { QueryRequest, QueryResponse } from "../types"
import { getStoredSession } from "../lib/auth"

const API_BASE_URL = import.meta.env.VITE_BASE_URL
export async function askQuestion(payload: QueryRequest): Promise<QueryResponse> {
    const session = getStoredSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        throw new Error('Login again to ask a question.')
    }

    const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error('Login again to ask a question.')
    }

    return response.json()
}