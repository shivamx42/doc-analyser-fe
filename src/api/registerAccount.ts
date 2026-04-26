import type { RegisterRequest, RegisterResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function registerAccount(payload: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        let errorMessage = 'Registration failed'

        try {
            const errorData = await response.json()
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : errorMessage
        } catch {}

        throw new Error(errorMessage)
    }

    return response.json()
}