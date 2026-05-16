import { useCallback, useState, useSyncExternalStore } from 'react'
import { FileText, X } from 'lucide-react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Header from './components/Header'
import QueryPanel from './components/AskQuestion'
import Account from './components/Account'
import DocumentsPanel from './components/DocumentsPanel'
import LogoutButton from './components/LogoutButton'
import UploadPanel from './components/UploadDocumet'
import PublicQueryPage from './components/PublicQueryPage'
import { getStoredSession, subscribeToAuthChanges } from './lib/auth'

function Dashboard({ 
    documentsRefreshKey, 
    setDocumentsRefreshKey, 
    selectedDocumentIds, 
    setSelectedDocumentIds,
    documentsPanelOpen,
    setDocumentsPanelOpen,
    documentsState,
    handleDocumentsStateChange
}: any) {
    return (
        <main className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-start">
            <section className="flex min-w-0 flex-col gap-5">
                <UploadPanel
                    onUploadSuccess={() => {
                        setDocumentsRefreshKey((current: number) => current + 1)
                    }}
                />

                <button
                    type="button"
                    aria-controls="documents-panel"
                    aria-expanded={documentsPanelOpen}
                    onClick={() => setDocumentsPanelOpen(true)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-900 px-4 py-3 text-left transition hover:border-[#44a1bb] lg:hidden"
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="rounded-md border border-[#44a1bb]/30 bg-[#44a1bb]/10 p-2 text-[#83cfe4]">
                            <FileText className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-semibold text-stone-50">Uploaded documents</span>
                            <span className="block text-xs text-stone-500">
                                {documentsState.loading
                                    ? 'Loading documents...'
                                    : `${documentsState.count} uploaded - ${selectedDocumentIds.length} selected`}
                            </span>
                        </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-stone-950 px-2 py-1 text-xs font-semibold text-[#83cfe4]">
                        Open
                    </span>
                </button>

                <div
                    id="documents-panel"
                    className={`${
                        documentsPanelOpen
                            ? 'fixed inset-0 z-50 flex items-end bg-stone-950/80 p-4 backdrop-blur-sm sm:items-center sm:justify-center'
                            : 'hidden'
                    } lg:static lg:z-auto lg:block lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}
                >
                    <div className="w-full max-w-lg lg:max-w-none">
                        <div className="mb-3 flex items-center justify-between rounded-lg border border-stone-800 bg-stone-900 px-4 py-3 lg:hidden">
                            <div>
                                <p className="text-sm font-semibold text-stone-50">Uploaded documents</p>
                                <p className="text-xs text-stone-500">Choose what the question panel should search.</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close documents panel"
                                onClick={() => setDocumentsPanelOpen(false)}
                                className="rounded-md p-2 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <DocumentsPanel
                            refresh={documentsRefreshKey}
                            selectedDocumentIds={selectedDocumentIds}
                            onSelectedDocumentIdsChange={setSelectedDocumentIds}
                            onDocumentsStateChange={handleDocumentsStateChange}
                        />
                    </div>
                </div>
            </section>

            <section className="min-w-0">
                <QueryPanel
                    documentsLoading={documentsState.loading}
                    hasUploadedDocuments={documentsState.count > 0}
                    selectedDocumentIds={selectedDocumentIds}
                />
            </section>

            <div className="flex justify-center lg:col-span-2">
                <LogoutButton />
            </div>
        </main>
    )
}

function App() {
    const session = useSyncExternalStore(subscribeToAuthChanges, getStoredSession, () => null)
    const [documentsRefreshKey, setDocumentsRefreshKey] = useState(0)
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([])
    const [documentsPanelOpen, setDocumentsPanelOpen] = useState(false)
    const [documentsState, setDocumentsState] = useState({
        count: 0,
        loading: true,
    })

    const handleDocumentsStateChange = useCallback((nextState: { count: number; loading: boolean }) => {
        setDocumentsState((currentState) => {
            if (currentState.count === nextState.count && currentState.loading === nextState.loading) {
                return currentState
            }
            return nextState
        })
    }, [])

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-stone-950 text-stone-100">
            <Routes>
                <Route path="/share/:token" element={<PublicQueryPage />} />
                <Route 
                    path="/" 
                    element={
                        <div className="flex min-h-screen flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                            <div className="flex justify-center">
                                <Header />
                            </div>
                            {session ? (
                                <Dashboard 
                                    documentsRefreshKey={documentsRefreshKey}
                                    setDocumentsRefreshKey={setDocumentsRefreshKey}
                                    selectedDocumentIds={selectedDocumentIds}
                                    setSelectedDocumentIds={setSelectedDocumentIds}
                                    documentsPanelOpen={documentsPanelOpen}
                                    setDocumentsPanelOpen={setDocumentsPanelOpen}
                                    documentsState={documentsState}
                                    handleDocumentsStateChange={handleDocumentsStateChange}
                                />
                            ) : (
                                <Account />
                            )}
                        </div>
                    } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App