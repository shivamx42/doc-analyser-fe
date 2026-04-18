import Header from './components/Header'
import QueryPanel from './components/AskQuestion'
import UploadPanel from './components/UploadDocumet'

function App() {
    return (
        <div className="min-h-screen bg-stone-950 px-6 py-10 text-stone-100 flex flex-col gap-6">
            <div className='flex justify-center'>
                <Header />
            </div>
            
            <UploadPanel />
            <QueryPanel />
        </div>
    )
}

export default App
