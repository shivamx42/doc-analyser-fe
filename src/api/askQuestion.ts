import type { QueryRequest, QueryResponse } from "../types"

const API_BASE_URL = import.meta.env.VITE_BASE_URL
export async function askQuestion(payload: QueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error("Failed to get answer")
    }

    return response.json()
}