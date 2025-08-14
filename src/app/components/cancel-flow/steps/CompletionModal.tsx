'use client'

interface CompletionModalProps {
	onFinish: () => void
}

export default function CompletionModal({ onFinish }: CompletionModalProps) {
	return (
		<div className="flex flex-col h-full">
			{/* Content section */}
			<div className="flex-1">
				{/* Title */}
				<h1 
					id="cancel-complete-title"
					className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
				>
					All done, your cancellation's been processed.
				</h1>
				
				{/* Body text */}
				<p className="mt-3 text-[14px] leading-6 text-neutral-600">
					We're stoked to hear you've landed a job and sorted your visa. Big congrats from the team. 🙌
				</p>
			</div>
			
			{/* Button section */}
			<div className="mt-6">
				<button
					onClick={onFinish}
					className="h-12 w-full rounded-xl bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 transition-all"
				>
					Finish
				</button>
			</div>
		</div>
	)
}
