'use client'

import { useState } from 'react'

export default function J2Feedback({ foundViaUs, onNext }: { foundViaUs: boolean; onNext: (payload: { visa?: string; freeform?: string }) => void }) {
	const [visa, setVisa] = useState<string>('')
	const [freeform, setFreeform] = useState('')
	const visaRequired = foundViaUs
	const valid = visaRequired ? visa.trim().length > 0 : true
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Share a bit more</h2>
			{foundViaUs && (
				<div className="mt-3">
					<label className="block text-sm mb-1">What visa will you be applying for?</label>
					<select value={visa} onChange={(e) => setVisa(e.target.value)} className="rounded-xl border px-3 py-2">
						<option value="">Select one</option>
						<option value="h1b">H1B</option>
						<option value="opt">OPT</option>
						<option value="stem_opt">STEM OPT</option>
						<option value="o1">O1</option>
						<option value="other">Other</option>
					</select>
				</div>
			)}
			<div className="mt-3">
				<textarea value={freeform} onChange={(e) => setFreeform(e.target.value.slice(0, 1000))} className="w-full rounded-xl border px-3 py-2" rows={4} placeholder="Anything else to share?" />
			</div>
			<div className="mt-4">
				<button className="h-10 px-4 rounded-xl bg-black text-white disabled:opacity-40" disabled={!valid} onClick={() => onNext({ visa: visa || undefined, freeform: freeform.trim() || undefined })}>Next</button>
			</div>
		</div>
	)
}


