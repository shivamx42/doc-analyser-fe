import type { LoginRequest, LoginResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export async function loginAccount(payload: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        let errorMessage = 'Login failed'

        try {
            const errorData = await response.json()
            console.log(errorData)
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : errorMessage
        } catch {}

        throw new Error(errorMessage)
    }

    return response.json()
}