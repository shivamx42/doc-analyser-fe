import { clearSession } from '../lib/auth'

export default function LogoutButton() {
    return (
        
        <div className="flex justify-center">
            <button
                type="button"
                onClick={clearSession}
                className="rounded-2xl bg-[#44a1bb] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:cursor-pointer hover:bg-[#47acc8]"
            >
                Logout
            </button>
        </div>
        
    )
}