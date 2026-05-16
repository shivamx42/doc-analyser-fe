import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { FileText, Loader2, Share2 } from 'lucide-react'

import { getDocuments } from '../api/getDocuments'
import DeleteDocumentButton from './DeleteDocumentButton'
import type { DocumentListItem } from '../types'
import ShareModal from './ShareModal'

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
    onDocumentsStateChange?: (state: { count: number; loading: boolean }) => void
}

export default function DocumentsPanel({
    refresh,
    selectedDocumentIds,
    onSelectedDocumentIdsChange,
    onDocumentsStateChange,
}: DocumentsPanelProps) {
    const [documents, setDocuments] = useState<DocumentListItem[]>([])
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const selectionLimit = Math.min(MAX_SELECTED_DOCUMENTS, documents.length)

    useEffect(() => {
        onDocumentsStateChange?.({
            count: documents.length,
            loading,
        })
    }, [documents.length, loading, onDocumentsStateChange])

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

    function handleDeletedDocument(documentId: string) {
        setDocuments((currentDocuments) => (
            currentDocuments.filter((document) => document.id !== documentId)
        ))
        onSelectedDocumentIdsChange((currentDocumentIds) => (
            currentDocumentIds.filter((selectedDocumentId) => selectedDocumentId !== documentId)
        ))
    }

    return (
        <div className="w-full rounded-lg border border-stone-800 bg-stone-900 p-4 max-h-96 overflow-auto">
            {loading || !name ? (null) : (
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-base font-bold text-stone-300">{name}'s Documents</h2>
                        <p className="mt-1 text-xs text-stone-400">
                            {documents.length > 0
                                ? `Select up to ${selectionLimit} document${selectionLimit === 1 ? '' : 's'}`
                                : 'Upload documents to search them'}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {documents.length > 0 ? (
                            <p className="shrink-0 rounded-md border border-[#44a1bb]/30 bg-[#44a1bb]/10 px-2 py-1 text-xs font-semibold text-[#83cfe4]">
                                {selectedDocumentIds.length}/{selectionLimit}
                            </p>
                        ) : null}
                        
                        {selectedDocumentIds.length > 0 && (
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-md bg-[#44a1bb] px-2.5 py-1.5 text-xs font-bold text-stone-950 transition hover:bg-[#388ba3] cursor-pointer "
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {isShareModalOpen && (
                <ShareModal 
                    selectedDocumentIds={selectedDocumentIds} 
                    onClose={() => setIsShareModalOpen(false)} 
                />
            )}

            

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Loading documents...
                </div>
            ) : null}

            {error ? (
                <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                </p>
            ) : null}

            {!loading && !error && documents.length === 0 ? (
                <div className="mt-4 rounded-md border border-dashed border-stone-700 bg-stone-950/80 px-3 py-4 text-sm text-stone-400">
                    No documents uploaded yet
                </div>
            ) : null}

            {!loading && !error && documents.length > 0 ? (
                <div className="mt-4 flex flex-col gap-2 pr-1">
                    {documents.map((document) => {
                        const isSelected = selectedDocumentIds.includes(document.id)
                        const selectionDisabled = !isSelected && selectedDocumentIds.length >= MAX_SELECTED_DOCUMENTS

                        return (
                            <div
                                key={document.id}
                                className={`rounded-md border px-3 py-3 transition ${
                                    isSelected
                                        ? 'border-[#44a1bb] bg-[#44a1bb]/15'
                                        : 'border-stone-700 bg-stone-950 hover:border-stone-500'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleDocument(document.id)}
                                        disabled={selectionDisabled}
                                        className={`flex min-w-0 flex-1 items-start gap-3 text-left ${
                                            selectionDisabled
                                                ? 'cursor-not-allowed opacity-45'
                                                : 'cursor-pointer'
                                        }`}
                                    >
                                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#83cfe4]" aria-hidden="true" />
                                        <div className="min-w-0">
                                            <h3 className="wrap-break-word text-sm font-semibold text-stone-100">
                                                {truncateText(document.filename)}
                                            </h3>
                                            <div className="mt-1 flex flex-col gap-0.5 text-xs text-stone-400 sm:flex-row sm:gap-2">
                                                <p>{document.total_pages} {document.total_pages === 1 ? "page" : "pages"}</p>
                                                <p>Added {formatCreatedAt(document.created_at)}</p>
                                            </div>
                                        </div>
                                    </button>

                                    <DeleteDocumentButton
                                        documentId={document.id}
                                        filename={document.filename}
                                        onDeleted={handleDeletedDocument}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}
