# Frontend Overview

This frontend is the user interface for **Doc Analyser**.
It is a React + Vite application where users can create an account, log in, upload documents, choose which documents to search, and ask questions about their uploaded content.

## What This Frontend Does

- Shows the authentication screen when the user is logged out.
- Stores the login session in browser local storage.
- Lets users upload `PDF` and `TXT` files.
- Displays the user's uploaded documents.
- Allows selecting up to 10 documents for focused search.
- Sends questions to the backend and displays the generated answer.
- Lets users delete documents from their library.
- **Generates shareable links** for specific documents.
- **Provides a public interface** for querying shared documents without an account.


## User Experience Flow

### 1. Authentication

If there is no saved session, the app renders the account screen.
After login, the access token and user details are stored locally and reused for API calls.

Relevant files:

- `src/components/Account.tsx`
- `src/api/registerAccount.ts`
- `src/api/loginAccount.ts`
- `src/lib/auth.ts`

### 2. Upload Documents

The upload panel sends a selected file to the backend using `multipart/form-data`.
Successful uploads trigger a refresh of the document list.

Relevant files:

- `src/components/UploadDocumet.tsx`
- `src/api/uploadDocument.ts`

### 3. Manage Documents

The documents panel:

- fetches the logged-in user's documents
- shows upload history
- tracks which documents are selected
- enforces a max selection of 10 documents
- supports document deletion

Relevant files:

- `src/components/DocumentsPanel.tsx`
- `src/components/DeleteDocumentButton.tsx`
- `src/api/getDocuments.ts`
- `src/api/deleteDocument.ts`

### 4. Ask Questions

The question panel sends:

- the user's question
- the selected document IDs

If no documents are selected, the backend search applies to all of the user's uploaded documents.

Relevant files:

- `src/components/AskQuestion.tsx`
- `src/api/askQuestion.ts`

### 5. Sharing & Public Queries

Authenticated users can generate a share link for selected documents. Recipients land on a public query page that fetches document metadata and allows AI querying.

Relevant files:

- `src/components/ShareModal.tsx`
- `src/components/PublicQueryPage.tsx`
- `src/api/share.ts`


## Project Structure

```text
frontend/
  public/
    favicon.svg
  src/
    api/
      askQuestion.ts
      deleteDocument.ts
      getDocuments.ts
      loginAccount.ts
      registerAccount.ts
      uploadDocument.ts
    components/
      Account.tsx
      AskQuestion.tsx
      DeleteDocumentButton.tsx
      DocumentsPanel.tsx
      Header.tsx
      LogoutButton.tsx
      UploadDocumet.tsx
      ShareModal.tsx         # link generation modal
      PublicQueryPage.tsx    # public chat interface
    lib/

      auth.ts              # local session storage and auth subscriptions
    App.tsx                # top-level app layout and screen switching
    main.tsx               # React entry point
    types.ts               # shared frontend TypeScript types
    index.css              # global styling
  index.html
  package.json
  vite.config.ts
```

## How The Frontend Talks To The Backend

All API helpers use:

- `VITE_BASE_URL` as the backend base URL
- bearer-token authorization for protected routes

Backend routes used by the frontend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/upload`
- `GET /api/documents`
- `DELETE /api/documents/delete/{document_id}`
- `POST /api/query`
- `GET /api/share/{token}`
- `POST /api/share/{token}/query`


## State Management

The app keeps state simple and local:

- auth session is stored in `localStorage`
- `useSyncExternalStore` keeps the UI in sync with auth changes
- React component state tracks document refreshes, document selection, loading, errors, and answers

This keeps the project lightweight without adding a larger state library.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## Environment Variable

The frontend expects:

- `VITE_BASE_URL`

Example meaning:

- local backend URL during development
- deployed API URL in production

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Access the app at: http://localhost:5173

## Important Notes

- Protected API calls fail fast if no access token is available.
- The UI is designed around the document-analysis flow rather than generic file storage.
- Document selection directly affects what context the backend searches before generating an answer.