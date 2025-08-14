'use client'

import { useState } from 'react'

export default function S0Entry({ onNext }: { onNext: (foundJob: boolean) => void }) {
	const [choice, setChoice] = useState<'found' | 'looking' | null>(null)
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Cancel subscription</h2>
			<p className="text-sm md:text-base text-muted-foreground">Why are you canceling?</p>
			<div className="mt-4 space-y-2">
				<label className="flex items-center gap-2">
					<input type="radio" name="branch" onChange={() => setChoice('found')} />
					<span>Yes, I found a job</span>
				</label>
				<label className="flex items-center gap-2">
					<input type="radio" name="branch" onChange={() => setChoice('looking')} />
					<span>Not yet, I’m still looking</span>
				</label>
			</div>
			<div className="mt-4">
				<button
					className="h-10 px-4 rounded-xl bg-black text-white disabled:opacity-40"
					disabled={!choice}
					onClick={() => choice && onNext(choice === 'found')}
				>
					Next
				</button>
			</div>
		</div>
	)
}


