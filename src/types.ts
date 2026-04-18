export type UploadResponse = {
    filename: string
    size_mb: number
    content_type: string
    total_pages: number
}

export type QueryRequest = {
    question: string
    document_id?: string
}

export type ChunkResult = {
    id: string
    document_id: string
    content: string
    similarity: number
}

export type QueryResponse = {
    question: string
    answer: string
    results: ChunkResult[]
}