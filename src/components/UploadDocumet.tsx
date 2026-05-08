import { useRef, useState } from 'react'
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react'

import { uploadDocument } from '../api/uploadDocument'
import type { UploadResponse } from '../types'

type UploadPanelProps = {
    onUploadSuccess?: () => void
}

function formatFileSize(size: number) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

export default function UploadPanel({ onUploadSuccess }: UploadPanelProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [data, setData] = useState<UploadResponse | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    async function handleUpload() {
        if (!file) {
            setData(null)
            setError('Choose a PDF or TXT file first.')
            return
        }

        setLoading(true)
        setError("")
        setData(null)

        try {
            const response = await uploadDocument(file)
            setData(response)
            onUploadSuccess?.()
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
        } finally {
            setLoading(false)
            setFile(null)
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }

    return (
        <div className="w-full rounded-lg border border-stone-800 bg-stone-900 p-4 shadow-sm shadow-black/20">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-bold text-stone-300">Upload</h2>
                    <p className="mt-1 text-xs text-stone-400">PDF or TXT, up to 10MB</p>
                </div>
                <div className="rounded-md border border-[#44a1bb]/30 bg-[#44a1bb]/10 p-2 text-[#83cfe4]">
                    <UploadCloud className="h-4 w-4" aria-hidden="true" />
                </div>
            </div>

            <input
                type="file"
                accept=".pdf,.txt"
                ref={inputRef}
                onChange={(event) => {
                    const newFile = event.target.files?.[0] ?? null
                    setFile(newFile)
                    setError("")
                    setData(null)
                }}
                className="sr-only"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-700 bg-stone-950 px-4 text-sm font-medium text-stone-100 transition hover:border-[#44a1bb] hover:text-[#9bd9e9] cursor-pointer"
                >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {file ? 'Change file' : 'Choose file'}
                </button>

                <button
                    type="button"
                    onClick={() => void handleUpload()}
                    disabled={loading || !file}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#44a1bb] px-4 text-sm font-semibold text-stone-950 transition hover:bg-[#47acc8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {file ? (
                <div className="mt-3 flex min-w-0 items-center gap-2 rounded-md border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-300">
                    <FileText className="h-4 w-4 shrink-0 text-[#83cfe4]" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-stone-100">{file.name}</p>
                        <p className="text-xs text-stone-500">{formatFileSize(file.size)}</p>
                    </div>
                    {!loading && (<button
                        type="button"
                        aria-label="Remove selected file"
                        onClick={() => {
                            setFile(null)
                            if (inputRef.current) {
                                inputRef.current.value = ""
                            }
                        }}
                        className="rounded-md p-1 text-stone-500 transition hover:bg-stone-800 hover:text-stone-100 hover:cursor-pointer"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>)}
                </div>
            ) : null}

            {error ? (
                <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                </p>
            ) : null}

            {data ? (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                        <p className="truncate font-medium">Uploaded {data.filename}</p>
                        <p className="text-xs text-emerald-200/80">
                            {data.total_pages} {data.total_pages === 1 ? 'page' : 'pages'} - {data.size_mb.toFixed(2)} MB
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
