export default function BidButton({handleBidSubmit, disabled, isBidding }: { handleBidSubmit: () => void, disabled?: boolean, isBidding: boolean }) {
    return (
        <button
            className="bg-[#4ade80] text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#3bcf71] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            disabled={disabled}
            onClick={handleBidSubmit}
        >
            {isBidding ? "Odesílám..." : (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                        <path d="m16 16 6-6"></path>
                        <path d="m8 8 6-6"></path>
                        <path d="m9 7 8 8"></path>
                        <path d="m21 11-8-8"></path>
                    </svg>
                    Přihodit
                </>
            )}
        </button>
    )
}