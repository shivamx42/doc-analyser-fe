import { useState } from 'react'

import { askQuestion } from '../api/askQuestion'
import type { QueryResponse } from '../types'

type QueryPanelProps = {
    selectedDocumentIds: string[]
}

export default function QueryPanel({ selectedDocumentIds }: QueryPanelProps) {
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [data, setData] = useState<QueryResponse | null>(null)

    async function handleQuery() {
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
        <div className="rounded-3xl border border-stone-800 bg-stone-900 p-6 max-w-2xl ml-0 sm:ml-15">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-stone-50"></h2>
                <h1 className="text-lg text-stone-100">
                    Ask about the uploaded content and get an answer back
                </h1>
            </div>

            <p className="mt-4 rounded-2xl border border-stone-800 bg-stone-950/70 px-4 py-3 text-sm text-stone-400">
                {selectedDocumentIds.length > 0
                    ? `Searching in ${selectedDocumentIds.length} selected document${selectedDocumentIds.length === 1 ? '' : 's'}.`
                    : 'No documents selected, search will include all your documents.'}
            </p>

            <div className="mt-5 block text-sm text-stone-300">
                <span className="mb-4 block font-semibold">Question</span>
                <textarea
                    value={question}
                    onChange={(event) => {
                        setQuestion(event.target.value)
                        setError("")
                    }}
                    rows={3}
                    placeholder="Ask relevant questions"
                    className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-lg sm:text-sm text-stone-100 outline-none placeholder:text-stone-500"
                />
            </div>

            {question && (<div className=" text-sm font-bold text-[#7699ae] hover:text-[#64879b] cursor-pointer mt-3 ml-1" onClick={() => {
                            setQuestion("")
                            setData(null)
                        }}>
                            
                            Clear Question
                        </div>)}

            <div className='flex justify-center'>
                <button
                    type="button"
                    onClick={() => void handleQuery()}
                    disabled={loading}
                    className="mt-5 rounded-2xl bg-[#44a1bb] hover:bg-[#47acc8] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Thinking...' : 'Ask question'}
                </button>
            </div>
            

            {error ? (
                <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex justify-center">
                    {error}
                </p>
            ) : null}

            {data ? (
                <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950 p-4">
                    <p className="text-md uppercase tracking-wider text-[#1c7cdc]">Answer</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-200">
                        {data.answer}
                    </p>
                </div>
            ) : null}
        </div>
    )
}