'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'

type ModalProps = {
	open: boolean
	onClose: () => void
	label: string
}

export default function Modal({ open, onClose, label, children }: PropsWithChildren<ModalProps>) {
	const containerRef = useRef<HTMLDivElement>(null)
	const firstFocusableRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!open) return
		const previousActive = document.activeElement as HTMLElement | null
		firstFocusableRef.current?.focus()
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.preventDefault()
				onClose()
				return
			}
			if (e.key !== 'Tab') return
			const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			)
			if (!focusables || focusables.length === 0) return
			const first = focusables[0]
			const last = focusables[focusables.length - 1]
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault()
					last.focus()
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault()
					first.focus()
				}
			}
		}
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('keydown', onKey)
			previousActive?.focus?.()
		}
	}, [open, onClose])

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" aria-hidden={!open}>
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div
				ref={containerRef}
				role="dialog"
				aria-modal="true"
				aria-label={label}
				className="relative z-10 w-full max-w-5xl mx-auto px-4"
			>
				{/* Hidden button to trap initial focus */}
				<button ref={firstFocusableRef} className="sr-only" aria-hidden="true" />
				{children}
			</div>
		</div>
	)
}


