import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, Search, Loader2, ArrowLeft, MessageSquareQuote, X } from 'lucide-react'
import { getSharedLinkInfo, askSharedQuestion } from '../api/share'
import type { SharedLinkInfo, QueryResponse } from '../types'
import Header from './Header'

export default function PublicQueryPage() {
    const { token } = useParams<{ token: string }>()
    const [info, setInfo] = useState<SharedLinkInfo | null>(null)
    const [loadingInfo, setLoadingInfo] = useState(true)
    const [error, setError] = useState('')
    
    const [question, setQuestion] = useState('')
    const [querying, setQuerying] = useState(false)
    const [queryError, setQueryError] = useState('')
    const [answerData, setAnswerData] = useState<QueryResponse | null>(null)

    useEffect(() => {
        async function fetchInfo() {
            if (!token) return
            setLoadingInfo(true)
            setError('')
            try {
                const data = await getSharedLinkInfo(token)
                setInfo(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load shared link')
            } finally {
                setLoadingInfo(false)
            }
        }
        void fetchInfo()
    }, [token])

    async function handleQuery() {
        if (!token || !question.trim()) return
        
        setQuerying(true)
        setQueryError('')
        setAnswerData(null)
        
        try {
            const response = await askSharedQuestion(token, { question: question.trim() })
            setAnswerData(response)
        } catch (err) {
            setQueryError(err instanceof Error ? err.message : 'Failed to get answer')
        } finally {
            setQuerying(false)
        }
    }

    if (loadingInfo) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 text-stone-100">
                <Loader2 className="h-8 w-8 animate-spin text-[#44a1bb]" />
                <p className="mt-4 text-stone-400">Loading shared documents...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-4 text-center text-stone-100">
                <div className="rounded-full bg-red-500/10 p-4 text-red-400">
                    <FileText className="h-12 w-12" />
                </div>
                <h1 className="mt-6 text-2xl font-bold text-stone-300">Link Unavailable</h1>
                <p className="mt-2 max-w-md text-stone-400">{error}</p>
                <Link 
                    to="/" 
                    className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#83cfe4] hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Doc Analyser
                </Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-stone-950 px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-8">
                <Header />
            </div>

            <main className="mx-auto w-full max-w-3xl">
                <div className="mb-8 overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-xl">
                    <div className="border-b border-stone-800 bg-stone-900/50 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-[#44a1bb]/10 p-2 text-[#83cfe4]">
                                <MessageSquareQuote className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-stone-300">
                                    {info?.owner_name} shared documents with you
                                </h1>
                                <p className="text-xs text-stone-400 mt-2">You can query these documents without an account</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Shared Documents</p>
                        <div className="flex flex-wrap gap-2">
                            {info?.document_names.map((name, i) => (
                                <span 
                                    key={i} 
                                    className="flex items-center gap-1.5 rounded-full border border-stone-700 bg-stone-950 px-3 py-1 text-xs text-stone-300"
                                >
                                    <FileText className="h-3 w-3 text-[#83cfe4]" />
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-6 shadow-xl">
                    <h2 className="mb-4 text-base font-semibold text-stone-300">Ask a question</h2>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What is the main conclusion of the report?"
                        className="min-h-[120px] w-full rounded-lg border border-stone-700 bg-stone-950 p-4 text-stone-100 outline-none transition focus:border-[#44a1bb]"
                    />
                    
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {question ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuestion("")
                                    setAnswerData(null)
                                }}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#83cfe4] transition hover:text-[#a4e6f6] cursor-pointer"
                            >
                                <X className="h-4 w-4 mt-1 ml-1" aria-hidden="true" />
                                Clear
                            </button>
                        ) : (
                            <span />
                        )}

                        <button
                            onClick={handleQuery}
                            disabled={querying || !question.trim()}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#44a1bb] px-4 text-sm font-semibold text-stone-950 transition hover:bg-[#47acc8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            {querying ? (
                                <>
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4" />
                                    Search
                                </>
                            )}
                        </button>
                    </div>

                    {queryError && (
                        <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {queryError}
                        </p>
                    ) }

                    {answerData ? (
                        <div className="mt-5 rounded-lg border border-stone-700 bg-stone-950 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#83cfe4]">Answer</p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-200">
                                {answerData.answer}
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-stone-500">
                        Want to analyze your own documents? 
                        <Link to="/" className="ml-1 text-[#83cfe4] hover:underline">
                            Create a free account
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}