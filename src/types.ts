export type UploadResponse = {
    filename: string
    size_mb: number
    content_type: string
    total_pages: number
}

export type QueryRequest = {
    question: string
    document_ids?: string[]
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

export type RegisterRequest = {
    email: string
    password: string
    display_name: string
}

export type RegisterResponse = {
    user_id: string
    email: string
    display_name: string
    message: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    access_token: string
    refresh_token: string
    user_id: string
    email: string
    display_name: string
}

export type AuthSession = {
    accessToken: string
    refreshToken: string
    userId: string
    email: string
    displayName: string
}

export type DocumentListItem = {
    id: string
    filename: string
    content_type: string
    total_pages: number
    created_at: string
}

export type DocumentListResponse = {
    documents: DocumentListItem[]
    name: string
}

export type DeleteDocumentResponse = {
    document_id: string
    message: string
}

export type ShareRequest = {
    document_ids: string[]
}

export type ShareResponse = {
    token: string
    share_url: string
}

export type SharedLinkInfo = {
    document_names: string[];
    owner_name: string;
}

export type SharedQueryRequest = {
    question: string
}