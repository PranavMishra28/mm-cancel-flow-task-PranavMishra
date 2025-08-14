'use client'

import { useEffect, useReducer, useState } from 'react'
import S0Entry from './steps/S0Entry'
import J1Congrats from './steps/J1Congrats'
import J2Feedback from './steps/J2Feedback'
import J3Done from './steps/J3Done'
import D1Downsell from './steps/D1Downsell'
import N1Improve from './steps/N1Improve'
import N2MainReason from './steps/N2MainReason'
import N3Done from './steps/N3Done'
import Modal from '@/components/Modal'

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
        cancel: 'Subscription Cancellation',
        congrats: 'Congrats on the new role!'
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
				console.log('Starting cancellation flow for subscription:', subscriptionId)
				
				// Touch GET to set CSRF cookies
				const getRes = await fetch('/api/cancellations/start', { method: 'GET' })
				console.log('GET response:', getRes.status)
				
				// Wait a moment for cookies to be set
				await new Promise(resolve => setTimeout(resolve, 100))
				
				const csrf = getCookie('csrf_token_mirror') || ''
				console.log('CSRF token after GET:', csrf ? csrf.substring(0, 8) + '...' : 'missing')
				console.log('All cookies:', document.cookie)
				
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
				
				console.log('POST response:', res.status, res.statusText)
				
				if (!res.ok) {
					const errorText = await res.text()
					console.error('Start failed:', { status: res.status, body: errorText })
					throw new Error(`Failed to start: ${res.status} ${res.statusText}`)
				}
				
				const data = await res.json()
				console.log('Start successful, data:', data)
				
				if (!active) return
				dispatch({ type: 'INIT', payload: data })
			} catch (e: any) {
				console.error('Start error:', e)
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
		console.log('Current state:', state)
		if (!state.cancellationId) {
			console.warn('No cancellation ID available, skipping save')
			return
		}
		setError(null)
		const csrf = getCookie('csrf_token_mirror') || ''
		
		console.log('Saving data:', { data, cancellationId: state.cancellationId, csrf: csrf ? 'present' : 'missing' })
		
		const res = await fetch(`/api/cancellations/${state.cancellationId}`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': csrf,
				'x-user-id': '550e8400-e29b-41d4-a716-446655440001',
			},
			body: JSON.stringify(data),
		})
		
		if (!res.ok) {
			const errorText = await res.text()
			console.error('Save failed:', { status: res.status, statusText: res.statusText, body: errorText })
			throw new Error(`Failed to save: ${res.status} ${res.statusText}`)
		}
		
		console.log('Save successful')
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
                    <div className="rounded-2xl bg-white shadow-xl overflow-hidden max-w-4xl w-full">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <p className="text-sm text-gray-600 font-medium">{CONTENT.title.cancel}</p>
                            <button aria-label="Close" className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>×</button>
                        </div>
                        <div className="grid md:grid-cols-2 overflow-hidden min-h-[400px]">
                            {/* Mobile image on top */}
                            <div className="block md:hidden h-48 w-full">
                                <img src="/images/empire-state-compressed.jpg" alt="City skyline" className="h-full w-full object-cover" onError={(e) => console.error('Image failed to load:', e)} />
                            </div>
                            <div className="px-8 py-8 md:py-10 flex flex-col justify-center">
                                <S0Entry
                                    onYes={async () => {
                                        try {
                                            await save({ found_job: true })
                                            dispatch({ type: 'SET', payload: { found_job: true } })
                                            dispatch({ type: 'GO', step: 'J1' })
                                        } catch (err) {
                                            console.error('Save error:', err)
                                            // Continue to next step even if save fails
                                            dispatch({ type: 'SET', payload: { found_job: true } })
                                            dispatch({ type: 'GO', step: 'J1' })
                                        }
                                    }}
                                    onNo={async () => {
                                        try {
                                            await save({ found_job: false })
                                            dispatch({ type: 'SET', payload: { found_job: false } })
                                            if (state.variant === 'B') dispatch({ type: 'GO', step: 'D1' })
                                            else dispatch({ type: 'GO', step: 'N1' })
                                        } catch (err) {
                                            console.error('Save error:', err)
                                            // Continue to next step even if save fails
                                            dispatch({ type: 'SET', payload: { found_job: false } })
                                            if (state.variant === 'B') dispatch({ type: 'GO', step: 'D1' })
                                            else dispatch({ type: 'GO', step: 'N1' })
                                        }
                                    }}
                                />
                            </div>
                            <div className="hidden md:block p-4">
                                <div 
                                    className="h-full w-full bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg min-h-[400px]"
                                    style={{
                                        backgroundImage: 'url(/images/empire-state-compressed.jpg)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
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
                    <div className="rounded-2xl bg-white shadow-xl overflow-hidden max-w-6xl w-full">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => dispatch({ type: 'GO', step: 'S0' })}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                 <p className="text-sm text-gray-600 font-medium tracking-wide">{CONTENT.title.cancel}</p>
                                 <div className="flex items-center gap-3">
                                     <span className="text-xs text-gray-500 font-medium tracking-wide">Step 1 of 3</span>
                                     <div className="flex gap-2">
                                         <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300 shadow-sm"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300 shadow-sm"></div>
                                     </div>
                                 </div>
                             </div>
                            <button aria-label="Close" className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>×</button>
                        </div>
                        <div className="grid md:grid-cols-[55%_45%] items-stretch overflow-hidden">
                            {/* Mobile image on top */}
                            <div className="block md:hidden h-48 w-full">
                                <img src="/images/empire-state-compressed.jpg" alt="City skyline" className="h-full w-full object-cover" onError={(e) => console.error('Image failed to load:', e)} />
                            </div>
                            <div className="px-8 py-3 md:py-3 flex flex-col justify-between md:h-full">
                                <J1Congrats
                                     onNext={async (viaUs, formData) => {
                                         try {
                                             await save({ found_via_migratemate: viaUs })
                                             dispatch({ type: 'SET', payload: { found_via_migratemate: viaUs } })
                                             dispatch({ type: 'GO', step: 'J2' })
                                         } catch (err) {
                                             console.error('Save error:', err)
                                             // Continue to next step even if save fails
                                             dispatch({ type: 'SET', payload: { found_via_migratemate: viaUs } })
                                             dispatch({ type: 'GO', step: 'J2' })
                                         }
                                     }}
                                     onBack={() => dispatch({ type: 'GO', step: 'S0' })}
                                 />
                            </div>
                            <div className="hidden md:block pt-3 pb-3 pl-3 pr-3 md:h-full">
                                 <div 
                                     className="h-full w-full bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
                                     style={{
                                         backgroundImage: 'url(/images/empire-state-compressed.jpg)'
                                     }}
                                 />
                            </div>
                        </div>
                    </div>
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
        <Modal open={true} onClose={onClose} label={CONTENT.title.cancel}>
            {error && (
                <div className="mb-2">
                    <p className="text-red-600 text-sm" role="alert">{error}</p>
                </div>
            )}
            {stepEl}
        </Modal>
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


