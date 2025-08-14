'use client'

import { useState } from 'react'

export default function J1Congrats({ onNext }: { onNext: (foundViaUs: boolean) => void }) {
	const [choice, setChoice] = useState<boolean | null>(null)
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Congrats on the new role!</h2>
			<div className="mt-3 space-y-2">
				<label className="flex items-center gap-2">
					<input type="radio" name="via" onChange={() => setChoice(true)} />
					<span>I found it via Migrate Mate</span>
				</label>
				<label className="flex items-center gap-2">
					<input type="radio" name="via" onChange={() => setChoice(false)} />
					<span>I found it elsewhere</span>
				</label>
			</div>
			<div className="mt-4">
				<button className="h-10 px-4 rounded-xl bg-black text-white disabled:opacity-40" disabled={choice === null} onClick={() => onNext(!!choice)}>
					Next
				</button>
			</div>
		</div>
	)
}


