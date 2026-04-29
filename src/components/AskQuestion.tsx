import { useEffect, useState } from 'react'
import { FileQuestion, Search, X } from 'lucide-react'

import { askQuestion } from '../api/askQuestion'
import type { QueryResponse } from '../types'

type QueryPanelProps = {
    documentsLoading: boolean
    hasUploadedDocuments: boolean
    selectedDocumentIds: string[]
}

export default function QueryPanel({
    documentsLoading,
    hasUploadedDocuments,
    selectedDocumentIds,
}: QueryPanelProps) {
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [data, setData] = useState<QueryResponse | null>(null)

    const formReady = hasUploadedDocuments && !documentsLoading
    const askDisabled = loading || !formReady || !question.trim()

    useEffect(() => {
        if (!hasUploadedDocuments) {
            setQuestion("")
            setData(null)
            setError("")
        }
    }, [hasUploadedDocuments])

    async function handleQuery() {
        if (!formReady) {
            return
        }

        if (!question.trim()) {
            setError('Enter a question first')
            return
        }

        setLoading(true)
        setError("")
        setData(null)

        try {
            const response = await askQuestion({
                question: question.trim(),
                document_ids: selectedDocumentIds,
            })
            setData(response)
        } catch (queryError) {
            setError(queryError instanceof Error ? queryError.message : 'Query failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full rounded-lg border border-stone-800 bg-stone-900 p-4 shadow-sm shadow-black/20 lg:sticky lg:top-8 lg:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="mt-1 text-md text-stone-300 font-semibold">
                        Search your uploaded content and get a focused answer.
                    </p>
                </div>
                <div className="rounded-md border border-[#44a1bb]/30 bg-[#44a1bb]/10 p-2 text-[#83cfe4]">
                    <Search className="h-4 w-4" aria-hidden="true" />
                </div>
            </div>

            <p className="mt-4 rounded-md border border-stone-800 bg-stone-950/70 px-3 py-2 text-sm text-stone-400 w-max">
                {documentsLoading
                    ? 'Checking your document library...'
                    : !hasUploadedDocuments
                        ? 'Upload a document to ask questions'
                        : selectedDocumentIds.length > 0
                            ? `Searching in ${selectedDocumentIds.length} selected document${selectedDocumentIds.length === 1 ? '' : 's'}.`
                            : 'Search will include all your documents'}
            </p>

            {!formReady ? (
                <div className="mt-5 rounded-lg border border-dashed border-stone-700 bg-stone-950/70 px-4 py-8 text-center">
                    <FileQuestion className="mx-auto h-8 w-8 text-stone-500" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-semibold text-stone-100">
                        {documentsLoading ? 'Loading your documents' : 'No uploaded documents yet'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                        {documentsLoading
                            ? 'The question box will be ready once your document list loads.'
                            : 'Upload a PDF or TXT file first, then ask about its contents here.'}
                    </p>
                </div>
            ) : (
                <>
                    <label className="mt-5 block text-sm text-stone-300">
                        <span className="mb-2 block font-semibold">Question</span>
                        <textarea
                            value={question}
                            onChange={(event) => {
                                setQuestion(event.target.value)
                                setError("")
                            }}
                            rows={5}
                            placeholder="Ask relevant questions"
                            className="min-h-36 w-full resize-y rounded-md border border-stone-700 bg-stone-950 px-3 py-3 text-base text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[#44a1bb] sm:text-sm"
                        />
                    </label>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {question ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuestion("")
                                    setData(null)
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
                            type="button"
                            onClick={() => void handleQuery()}
                            disabled={askDisabled}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#44a1bb] px-4 text-sm font-semibold text-stone-950 transition hover:bg-[#47acc8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            <Search className="h-4 w-4" aria-hidden="true" />
                            {loading ? 'Thinking...' : 'Ask question'}
                        </button>
                    </div>
                </>
            )}
            

            {error ? (
                <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                </p>
            ) : null}

            {data ? (
                <div className="mt-5 rounded-lg border border-stone-700 bg-stone-950 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#83cfe4]">Answer</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-200">
                        {data.answer}
                    </p>
                </div>
            ) : null}
        </div>
    )
}