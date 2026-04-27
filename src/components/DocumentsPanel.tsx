import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { getDocuments } from '../api/getDocuments'
import type { DocumentListItem } from '../types'

const MAX_SELECTED_DOCUMENTS = 10

function truncateText(text: string, maxLength: number = 30) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

function formatCreatedAt(value: string) {
    const date = new Date(value)

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

type DocumentsPanelProps = {
    refresh: number
    selectedDocumentIds: string[]
    onSelectedDocumentIdsChange: Dispatch<SetStateAction<string[]>>
}

export default function DocumentsPanel({
    refresh,
    selectedDocumentIds,
    onSelectedDocumentIdsChange,
}: DocumentsPanelProps) {
    const [documents, setDocuments] = useState<DocumentListItem[]>([])
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        async function loadDocuments() {
            setLoading(true)
            setError("")

            try {
                const response = await getDocuments()

                setDocuments(response.documents)
                setName(response.name)
            } catch (documentsError) {
                setDocuments([])
                setError(
                    documentsError instanceof Error ? documentsError.message : 'Could not load your documents.',
                )
            } finally {
                setLoading(false)
            }
        }

        void loadDocuments()
    }, [refresh])

    function toggleDocument(documentId: string) {
        onSelectedDocumentIdsChange((currentDocumentIds) => {
            if (currentDocumentIds.includes(documentId)) {
                return currentDocumentIds.filter((selectedDocumentId) => selectedDocumentId !== documentId)
            }

            if (currentDocumentIds.length >= MAX_SELECTED_DOCUMENTS) {
                return currentDocumentIds
            }

            return [...currentDocumentIds, documentId]
        })
    }

    return (
        <div className="rounded-3xl border border-stone-800 bg-stone-900 p-6 w-full lg:sticky lg:top-10">
            {loading ? (null) : (<div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-stone-50">{name}'s Documents</h2>
                <p className="text-xs text-stone-500">
                    Select up to {MAX_SELECTED_DOCUMENTS} documents to narrow search
                </p>
                <p className="text-xs font-semibold text-[#7699ae]">
                    {selectedDocumentIds.length} / {MAX_SELECTED_DOCUMENTS} selected
                </p>
                
            </div>)}
            

            {loading ? (
                <p className="mt-5 text-sm text-stone-400">Loading documents...</p>
            ) : null}

            {error ? (
                <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </p>
            ) : null}

            {!loading && !error && documents.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-stone-700 bg-stone-950 p-4 text-sm text-stone-300">
                    No documents uploaded yet
                </div>
            ) : null}

            {!loading && !error && documents.length > 0 ? (
                <div className="mt-5 flex flex-col gap-3 max-h-96 overflow-y-auto pr-4">
                    {documents.map((document) => (
                        <button
                            key={document.id}
                            type="button"
                            onClick={() => toggleDocument(document.id)}
                            disabled={
                                !selectedDocumentIds.includes(document.id) && selectedDocumentIds.length >= MAX_SELECTED_DOCUMENTS
                            }
                            className={`rounded-2xl border p-4 text-left transition ${
                                selectedDocumentIds.includes(document.id)
                                    ? 'border-[#44a1bb] bg-[#44a1bb]/15'
                                    : 'border-stone-700 bg-stone-950 hover:border-stone-500'
                            } ${
                                !selectedDocumentIds.includes(document.id) &&
                                selectedDocumentIds.length >= MAX_SELECTED_DOCUMENTS
                                    ? 'cursor-not-allowed opacity-45'
                                    : 'cursor-pointer'
                            }`}
                        >
                            <h1 className="text-lg font-semibold text-stone-100 wrap-break-word">
                                {truncateText(document.filename, 30)}
                            </h1>
                            <div className="mt-3 flex flex-col gap-1 text-xs text-stone-400">
                                <p>{document.total_pages} pages</p>
                                <p>Added on {formatCreatedAt(document.created_at)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}