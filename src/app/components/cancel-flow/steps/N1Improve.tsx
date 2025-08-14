'use client'

import { useState } from 'react'

export default function N1Improve({ onNext }: { onNext: (data: { freeform?: string }) => void }) {
	const [freeform, setFreeform] = useState('')
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Help us improve your matches</h2>
			<div className="mt-3">
				<textarea
					value={freeform}
					onChange={(e) => setFreeform(e.target.value.slice(0, 1000))}
					className="w-full rounded-xl border px-3 py-2"
					rows={4}
					placeholder="Anything else to share?"
				/>
			</div>
			<div className="mt-4">
				<button className="h-10 px-4 rounded-xl bg-black text-white" onClick={() => onNext({ freeform: freeform.trim() || undefined })}>Next</button>
			</div>
		</div>
	)
}


