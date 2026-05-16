import { useState } from 'react'
import { Share2, Copy, Check, X, Loader2 } from 'lucide-react'
import { createSharedLink } from '../api/share'

type ShareModalProps = {
    selectedDocumentIds: string[]
    onClose: () => void
}

export default function ShareModal({ selectedDocumentIds, onClose }: ShareModalProps) {
    const [loading, setLoading] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    async function handleGenerateLink() {
        setLoading(true)
        setError('')
        try {
            const response = await createSharedLink({ document_ids: selectedDocumentIds })
            setShareUrl(response.share_url)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate link')
        } finally {
            setLoading(false)
        }
    }

    function handleCopy() {
        void navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#44a1bb]/10 p-2 text-[#83cfe4]">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-300">Share Documents</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-100 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!shareUrl ? (
                    <div className="space-y-4">
                        <p className="text-sm text-stone-400">
                            You are about to create a shareable link for {selectedDocumentIds.length} document{selectedDocumentIds.length === 1 ? '' : 's'}. 
                            Anyone with this link will be able to query these documents without an account.
                        </p>
                        
                        {error && (
                            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md p-2">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleGenerateLink}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#44a1bb] px-4 py-3 font-semibold text-stone-950 transition hover:bg-[#388ba3] disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Generate Share Link'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-stone-400">
                            Your link is ready! Copy it and share it with anyone.
                        </p>
                        
                        <div className="flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-950 p-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-stone-400 outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="flex shrink-0 items-center gap-1 rounded-md bg-[#44a1bb]/10 px-3 py-1.5 text-xs font-semibold text-[#83cfe4] transition hover:bg-[#44a1bb]/20 cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full rounded-lg border border-stone-700 py-2.5 text-sm font-semibold text-stone-300 transition hover:bg-stone-800 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}