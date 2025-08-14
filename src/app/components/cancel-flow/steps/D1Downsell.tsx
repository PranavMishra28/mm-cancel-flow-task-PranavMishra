'use client'

export default function D1Downsell({ planPriceCents, onAccept, onDecline }: { planPriceCents: number; onAccept: () => void; onDecline: () => void }) {
	const discounted = planPriceCents - 1000
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Stay and save $10 / month</h2>
			<p className="text-sm md:text-base text-muted-foreground mt-2">
				${(planPriceCents / 100).toFixed(0)} → <strong>${(discounted / 100).toFixed(0)}</strong>
			</p>
			<div className="mt-4 flex gap-3">
				<button className="h-10 px-4 rounded-xl bg-black text-white" onClick={onAccept}>Get the discount</button>
				<button className="text-sm underline" onClick={onDecline}>No thanks</button>
			</div>
		</div>
	)
}


