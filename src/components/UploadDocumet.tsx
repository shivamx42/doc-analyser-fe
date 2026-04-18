import { useRef, useState } from 'react'

import { uploadDocument } from '../api/uploadDocument'
import type { UploadResponse } from '../types'

export default function UploadPanel() {
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
        <div className="rounded-3xl border border-stone-800 bg-stone-900 p-6 max-w-lg">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-stone-50">Upload document</h2>
            </div>

            <div className="mt-5 block text-sm text-stone-300">
                <span className="mb-4 block">Choose PDF or TXT file (max 100mb)</span>
                <div className='flex flex-col sm:flex-row sm:items-center'>
                    <input
                        type="file"
                        accept=".pdf,.txt"
                        ref={inputRef}
                        onChange={(event) => {
                            const newFile = event.target.files?.[0] ?? null
                            setFile(newFile)
                            setError("")
                        }}
                        className="block rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-200 file:mr-4 file:rounded-xl file:border-0 file:bg-[#44a1bb] file:px-4 file:py-2 file:text-sm file:font-medium file:text-stone-950 w-max"
                    />
    
                        {file && (<div className=" text-sm font-bold text-[#7699ae] hover:text-[#64879b] cursor-pointer ml-4 mt-5 sm:mt-0" onClick={() => {
                            setFile(null)
                            if (inputRef.current) {
                                inputRef.current.value = ""
                            }
                        }}>
                            
                            Remove
                        </div>)}
                    
                        
                </div>
                
            </div>
            
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => void handleUpload()}
                    disabled={loading}
                    className="mt-5 rounded-2xl bg-[#44a1bb] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-[#47acc8] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            </div>
            

            {error ? (
                <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex justify-center">
                        {error}
            
                </p>
            ) : null}

            {data ? (
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100 flex flex-col gap-2 items-center">
                    <h1> Successfully Uploaded <strong>{data.filename} !</strong></h1>
                    
                    <p>
                        <strong>Pages:</strong> {data.total_pages}
                    </p>
                    <p>
                        <strong>Size:</strong> {data.size_mb.toFixed(2)} MB
                    </p>
                </div>
            ) : null}
        </div>
    )
}
