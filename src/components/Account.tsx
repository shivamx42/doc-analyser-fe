import { useState } from 'react'

import { loginAccount } from '../api/loginAccount'
import { registerAccount } from '../api/registerAccount'
import { storeSession } from '../lib/auth'

type AuthMode = 'login' | 'register'

const inputClassName = 'w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-stone-500'

export default function Account() {
    const [mode, setMode] = useState<AuthMode>('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    function resetMessages() {
        setError("")
        setSuccess("")
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!loginForm.email.trim() || !loginForm.password) {
            setSuccess("")
            setError('Enter your email and password to continue.')
            return
        }

        setLoading(true)
        resetMessages()

        try {
            const response = await loginAccount({
                email: loginForm.email.trim(),
                password: loginForm.password,
            })

            storeSession(response)
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (
            !registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password || !registerForm.confirmPassword
        ) {
            setSuccess("")
            setError('Fill in every field to create an account.')
            return
        }

        if (registerForm.password !== registerForm.confirmPassword) {
            setSuccess("")
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        resetMessages()

        try {
            await registerAccount({
                display_name: registerForm.name.trim(),
                email: registerForm.email.trim(),
                password: registerForm.password,
            })

            setMode('login')
            setSuccess('Account created successfully')
            setLoginForm({
                email: registerForm.email.trim(),
                password: registerForm.password,
            })
            setRegisterForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            })
        } catch (registerError) {
            setError(registerError instanceof Error ? registerError.message : 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="rounded-3xl border border-stone-800 bg-stone-900 p-6 max-w-2xl ml-0 sm:ml-15">
            <div className="mt- inline-flex rounded-2xl border border-stone-700 bg-stone-950 p-1">
                <button
                    type="button"
                    onClick={() => {
                        setMode('login')
                        resetMessages()
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        mode === 'login'
                            ? 'bg-[#44a1bb] text-stone-950'
                            : 'text-stone-300 hover:cursor-pointer hover:text-stone-100'
                    }`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode('register')
                        resetMessages()
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        mode === 'register'
                            ? 'bg-[#44a1bb] text-stone-950'
                            : 'text-stone-300 hover:cursor-pointer hover:text-stone-100'
                    }`}
                >
                    Register
                </button>
            </div>

            <form
                onSubmit={(event) => (mode === 'login' ? handleLogin(event) : handleRegister(event))}
                className="mt-5 flex flex-col gap-4"
            >
                {mode === 'register' ? (
                    <label className="block text-sm text-stone-300">
                        <span className="mb-2 block">Name</span>
                        <input
                            type="text"
                            value={registerForm.name}
                            onChange={(event) => {
                                setRegisterForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                                setError("")
                            }}
                            placeholder="Enter your name"
                            className={inputClassName}
                        />
                    </label>
                ) : null}

                <label className="block text-sm text-stone-300">
                    <span className="mb-2 block">Email</span>
                    <input
                        type="email"
                        value={mode === 'login' ? loginForm.email : registerForm.email}
                        onChange={(event) => {
                            const email = event.target.value

                            if (mode === 'login') {
                                setLoginForm((current) => ({
                                    ...current,
                                    email: email,
                                }))
                            } else {
                                setRegisterForm((current) => ({
                                    ...current,
                                    email: email,
                                }))
                            }

                            setError("")
                        }}
                        placeholder="Enter your email"
                        className={inputClassName}
                    />
                </label>

                <label className="block text-sm text-stone-300">
                    <span className="mb-2 block">Password</span>
                    <input
                        type="password"
                        value={mode === 'login' ? loginForm.password : registerForm.password}
                        onChange={(event) => {
                            const password = event.target.value

                            if (mode === 'login') {
                                setLoginForm((current) => ({
                                    ...current,
                                    password: password,
                                }))
                            } else {
                                setRegisterForm((current) => ({
                                    ...current,
                                    password: password,
                                }))
                            }

                            setError("")
                        }}
                        placeholder="Enter your password"
                        className={inputClassName}
                    />
                </label>

                {mode === 'register' ? (
                    <label className="block text-sm text-stone-300">
                        <span className="mb-2 block">Confirm password</span>
                        <input
                            type="password"
                            value={registerForm.confirmPassword}
                            onChange={(event) => {
                                setRegisterForm((current) => ({
                                    ...current,
                                    confirmPassword: event.target.value,
                                }))
                                setError("")
                            }}
                            placeholder="Confirm your password"
                            className={inputClassName}
                        />
                    </label>
                ) : null}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-[#44a1bb] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:cursor-pointer hover:bg-[#47acc8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? mode === 'login'
                                ? 'Logging in...'
                                : 'Creating account...'
                            : mode === 'login'
                              ? 'Login'
                              : 'Register'}
                    </button>
                </div>
            </form>

            {error ? (
                <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex justify-center">
                    {error}
                </p>
            ) : null}

            {success ? (
                <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 flex justify-center">
                    {success}
                </p>
            ) : null}
        </section>
    )
}