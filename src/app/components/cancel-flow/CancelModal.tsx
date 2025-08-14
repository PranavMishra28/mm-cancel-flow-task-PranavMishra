'use client'

import { useEffect, useMemo, useReducer, useState } from 'react'
import S0Entry from './steps/S0Entry'
import J1Congrats from './steps/J1Congrats'
import J2Feedback from './steps/J2Feedback'
import J3Done from './steps/J3Done'
import D1Downsell from './steps/D1Downsell'
import N1Improve from './steps/N1Improve'
import N2MainReason from './steps/N2MainReason'
import N3Done from './steps/N3Done'

type Variant = 'A' | 'B'
type StepId = 'S0' | 'J1' | 'J2' | 'J3' | 'D1' | 'N1' | 'N2' | 'N3'

type CancelState = {
	step: StepId
	cancellationId?: string
	variant?: Variant
	planPriceCents?: number
	found_job?: boolean
	found_via_migratemate?: boolean
}

type Action =
	| { type: 'INIT'; payload: { cancellationId: string; variant: Variant; planPriceCents: number } }
	| { type: 'GO'; step: StepId }
	| { type: 'SET'; payload: Partial<CancelState> }

function reducer(state: CancelState, action: Action): CancelState {
	switch (action.type) {
		case 'INIT':
			return { ...state, ...action.payload, step: 'S0' }
		case 'GO':
			return { ...state, step: action.step }
		case 'SET':
			return { ...state, ...action.payload }
		default:
			return state
	}
}

const CONTENT = {
	title: {
		cancel: 'Cancel subscription',
		congrats: 'Congrats on the new role!'
	},
	cta: {
		next: 'Next',
		back: 'Back',
		accept_discount: 'Get the discount',
		no_thanks: 'No thanks',
		return_profile: 'Return to Profile',
	},
}

export function CancelModal({ subscriptionId, onClose }: { subscriptionId: string; onClose: () => void }) {
	const [state, dispatch] = useReducer(reducer, { step: 'S0' })
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		let active = true
		async function start() {
			setLoading(true)
			setError(null)
			try {
				// Touch GET to set CSRF cookies
				await fetch('/api/cancellations/start', { method: 'GET' })
				const csrf = getCookie('csrf_token_mirror') || ''
				const res = await fetch('/api/cancellations/start', {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						'x-csrf-token': csrf,
						// Dev-only mocked session user id — matches seed user 1
						'x-user-id': '550e8400-e29b-41d4-a716-446655440001',
					},
					body: JSON.stringify({ subscriptionId }),
				})
				if (!res.ok) throw new Error('Failed to start')
				const data = await res.json()
				if (!active) return
				dispatch({ type: 'INIT', payload: data })
			} catch (e: any) {
				setError(e.message)
			} finally {
				if (active) setLoading(false)
			}
		}
		start()
		return () => {
			active = false
		}
	}, [subscriptionId])

	async function save(data: Record<string, unknown>) {
		if (!state.cancellationId) return
		setError(null)
		const csrf = getCookie('csrf_token_mirror') || ''
		const res = await fetch(`/api/cancellations/${state.cancellationId}`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': csrf,
				'x-user-id': '550e8400-e29b-41d4-a716-446655440001',
			},
			body: JSON.stringify(data),
		})
		if (!res.ok) throw new Error('Failed to save')
	}

	async function complete() {
		if (!state.cancellationId) return
		const csrf = getCookie('csrf_token_mirror') || ''
		const res = await fetch(`/api/cancellations/${state.cancellationId}/complete`, {
			method: 'POST',
			headers: { 'x-csrf-token': csrf, 'x-user-id': '550e8400-e29b-41d4-a716-446655440001' },
		})
		if (!res.ok) throw new Error('Failed to complete')
	}

	async function acceptDownsell() {
		if (!state.cancellationId) return
		const csrf = getCookie('csrf_token_mirror') || ''
		const res = await fetch(`/api/downsells/${state.cancellationId}/accept`, {
			method: 'POST',
			headers: { 'x-csrf-token': csrf, 'x-user-id': '550e8400-e29b-41d4-a716-446655440001' },
		})
		if (!res.ok) throw new Error('Failed to accept offer')
	}

	const stepEl = (() => {
		if (loading) return <p>Loading…</p>
		switch (state.step) {
			case 'S0':
				return (
					<S0Entry
						onNext={async (foundJob) => {
							await save({ found_job: foundJob })
							dispatch({ type: 'SET', payload: { found_job: foundJob } })
							if (foundJob) {
								dispatch({ type: 'GO', step: 'J1' })
								return
							}
							if (state.variant === 'B') dispatch({ type: 'GO', step: 'D1' })
							else dispatch({ type: 'GO', step: 'N1' })
						}}
					/>
				)
			case 'D1':
				return (
					<D1Downsell
						planPriceCents={state.planPriceCents ?? 0}
						onAccept={async () => {
							await acceptDownsell()
							onClose()
						}}
						onDecline={() => dispatch({ type: 'GO', step: 'N1' })}
					/>
				)
			case 'N1':
				return (
					<N1Improve
						onNext={async ({ freeform }) => {
							await save({ freeform_feedback: freeform ?? null })
							dispatch({ type: 'GO', step: 'N2' })
						}}
					/>
				)
			case 'N2':
				return (
					<N2MainReason
						onNext={async (payload) => {
							await save(payload)
							dispatch({ type: 'GO', step: 'N3' })
						}}
					/>
				)
			case 'N3':
				return (
					<N3Done
						onFinish={async () => {
							await complete()
							onClose()
						}}
					/>
				)
			case 'J1':
				return (
					<J1Congrats
						onNext={async (viaUs) => {
							await save({ found_via_migratemate: viaUs })
							dispatch({ type: 'SET', payload: { found_via_migratemate: viaUs } })
							dispatch({ type: 'GO', step: 'J2' })
						}}
					/>
				)
			case 'J2':
				return (
					<J2Feedback
						foundViaUs={!!state.found_via_migratemate}
						onNext={async ({ visa, freeform }) => {
							await save({ visa_type: visa ?? null, freeform_feedback: freeform ?? null })
							dispatch({ type: 'GO', step: 'J3' })
						}}
					/>
				)
			case 'J3':
				return (
					<J3Done
						onFinish={async () => {
							await complete()
							onClose()
						}}
					/>
				)
		}
	})()

	return (
		<div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-2xl w-full max-w-[680px] p-4 md:p-6">
				<div className="text-xs md:text-sm text-muted-foreground mb-3">
					Step {stepIndex(state.step, state.variant)} of {totalSteps(state)}
				</div>
				{error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
				{stepEl}
				<div className="mt-4 flex justify-end gap-2">
					<button className="text-sm underline" onClick={onClose}>Close</button>
				</div>
			</div>
		</div>
	)
}

function stepIndex(step: StepId, variant?: Variant): number {
	const order: StepId[] = ['S0', ...(variant === 'B' ? ['D1'] : []), 'N1', 'N2', 'N3']
	const idx = order.indexOf(step)
	return idx >= 0 ? idx + 1 : 1
}

function totalSteps(state: CancelState): number {
	if (['J1', 'J2', 'J3'].includes(state.step)) return 4
	return state.variant === 'B' ? 5 : 4
}

function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
	return match ? decodeURIComponent(match[2]) : null
}


