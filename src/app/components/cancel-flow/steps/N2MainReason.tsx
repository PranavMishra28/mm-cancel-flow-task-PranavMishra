'use client'

import { useMemo, useState } from 'react'

type ReasonKey = 'too_expensive' | 'not_finding_roles' | 'hired_elsewhere' | 'product_issues' | 'temporary_break' | 'other'

export default function N2MainReason({ onNext }: { onNext: (payload: { reason_key: ReasonKey; willing_to_pay_dollars?: number; freeform_feedback?: string }) => void }) {
	const [reason, setReason] = useState<ReasonKey | null>(null)
	const [price, setPrice] = useState<number | ''>('')
	const [freeform, setFreeform] = useState('')

	const valid = useMemo(() => {
		if (!reason) return false
		if (reason === 'too_expensive') return typeof price === 'number' && price >= 0 && price <= 500
		if (reason === 'product_issues') return freeform.trim().length <= 1000
		if (reason === 'other') return freeform.trim().length > 0 && freeform.trim().length <= 200
		return true
	}, [reason, price, freeform])

	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What’s your main reason for canceling?</h2>
			<div className="mt-3 space-y-2">
				{(['too_expensive','not_finding_roles','hired_elsewhere','product_issues','temporary_break','other'] as ReasonKey[]).map((rk) => (
					<label key={rk} className="flex items-center gap-2">
						<input type="radio" name="reason" onChange={() => setReason(rk)} />
						<span>{rk.replaceAll('_', ' ')}</span>
					</label>
				))}
			</div>
			{reason === 'too_expensive' && (
				<div className="mt-3">
					<label className="block text-sm mb-1">What monthly price would you be willing to pay?</label>
					<input
						type="number"
						min={0}
						max={500}
						value={price}
						onChange={(e) => setPrice(e.target.value === '' ? '' : Math.max(0, Math.min(500, Math.round(Number(e.target.value)))))}
						className="rounded-xl border px-3 py-2 w-32"
					/>
				</div>
			)}
			{reason === 'product_issues' && (
				<div className="mt-3">
					<textarea value={freeform} onChange={(e) => setFreeform(e.target.value.slice(0, 1000))} className="w-full rounded-xl border px-3 py-2" rows={4} placeholder="What wasn’t working?" />
				</div>
			)}
			{reason === 'other' && (
				<div className="mt-3">
					<input value={freeform} onChange={(e) => setFreeform(e.target.value.slice(0, 200))} className="rounded-xl border px-3 py-2 w-full" placeholder="Please specify" />
				</div>
			)}
			<div className="mt-4">
				<button
					className="h-10 px-4 rounded-xl bg-black text-white disabled:opacity-40"
					disabled={!valid}
					onClick={() => {
						if (!reason) return
						const payload: any = { reason_key: reason }
						if (reason === 'too_expensive' && typeof price === 'number') payload.willing_to_pay_dollars = price
						if (reason === 'product_issues' || reason === 'other') payload.freeform_feedback = freeform.trim()
						onNext(payload)
					}}
				>
					Next
				</button>
			</div>
		</div>
	)
}


