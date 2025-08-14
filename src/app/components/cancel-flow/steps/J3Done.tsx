'use client'

export default function J3Done({ onFinish }: { onFinish: () => void }) {
	return (
		<div>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">All set</h2>
			<p className="text-sm md:text-base text-muted-foreground">Weve marked your subscription for cancellation.</p>
			<div className="mt-4">
				<button className="h-10 px-4 rounded-xl bg-black text-white" onClick={onFinish}>Return to Profile</button>
			</div>
		</div>
	)
}


