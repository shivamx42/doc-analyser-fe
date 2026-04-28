import { useState } from 'react'
import { Trash2, TriangleAlert } from 'lucide-react'

import { deleteDocument } from '../api/deleteDocument'

type DeleteDocumentButtonProps = {
    documentId: string
    filename: string
    onDeleted: (documentId: string) => void
}

export default function DeleteDocumentButton({
    documentId,
    filename,
    onDeleted,
}: DeleteDocumentButtonProps) {
    const [deleting, setDeleting] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const [error, setError] = useState("")

    async function handleDelete() {
        setDeleting(true)
        setError("")

        try {
            await deleteDocument(documentId)
            onDeleted(documentId)
            setConfirming(false)
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this document.')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <button
                type="button"
                aria-label={`Delete ${filename}`}
                title="Delete document"
                onClick={() => {
                    setError("")
                    setConfirming(true)
                }}
                disabled={deleting}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-red-500/30 text-red-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
                {deleting ? (
                    <span className="h-3 w-3 rounded-full border-2 border-red-200 border-t-transparent animate-spin" />
                ) : (
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                )}
            </button>

            {confirming ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`delete-document-title-${documentId}`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 px-4"
                >
                    <div className="w-full max-w-sm rounded-2xl border border-stone-700 bg-stone-900 p-5 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-300">
                                <TriangleAlert aria-hidden="true" className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    id={`delete-document-title-${documentId}`}
                                    className="text-base font-semibold text-stone-50"
                                >
                                    Delete document?
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-stone-300">
                                    This will permanently delete{' '}
                                    <span className="font-semibold text-stone-100">{filename}</span>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setError("")
                                    setConfirming(false)
                                }}
                                disabled={deleting}
                                className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-stone-500 hover:bg-stone-800 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                disabled={deleting}
                                className="rounded-xl bg-red-400 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-red-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>

                        {error ? (
                            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                {error}
                            </p>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    )
}