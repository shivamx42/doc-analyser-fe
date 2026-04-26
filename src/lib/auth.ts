import type { AuthSession, LoginResponse } from '../types'

const AUTH_STORAGE_KEY = 'doc-analyser-auth-session'
const AUTH_CHANGE_EVENT = 'doc-analyser-auth-change'

let cachedSession: AuthSession | null = null

function isBrowser() {
    return typeof window !== 'undefined'
}

export function getStoredSession(): AuthSession | null {
    if (!isBrowser()) return null

    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawSession) {
        cachedSession = null
        return null
    }

    if (cachedSession) {
        return cachedSession
    }

    try {
        cachedSession = JSON.parse(rawSession) as AuthSession
        return cachedSession
    } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        cachedSession = null
        return null
    }
}

function notifyAuthChange() {
    if (!isBrowser()) return
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function storeSession(session: LoginResponse): AuthSession {
    const normalizedSession: AuthSession = {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        userId: session.user_id,
        email: session.email,
        displayName: session.display_name,
    }

    cachedSession = normalizedSession
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedSession))
    notifyAuthChange()

    return normalizedSession
}

export function clearSession() {
    if (!isBrowser()) return

    cachedSession = null
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    notifyAuthChange()
}

export function subscribeToAuthChanges(callback: () => void) {
    if (!isBrowser()) return () => undefined

    const handleStorage = (event: StorageEvent) => {
        if (event.key === AUTH_STORAGE_KEY) {
            cachedSession = null
            callback()
        }
    }

    const handleAuthChange = () => callback()

    window.addEventListener('storage', handleStorage)
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)

    return () => {
        window.removeEventListener('storage', handleStorage)
        window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
}