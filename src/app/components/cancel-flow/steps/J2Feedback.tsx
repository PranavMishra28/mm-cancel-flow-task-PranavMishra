'use client'

import { useState } from 'react'

interface J2FeedbackProps {
	foundViaUs: boolean
	onNext: (payload: { freeform?: string }) => void
	onBack: () => void
}

export default function J2Feedback({ foundViaUs, onNext, onBack }: J2FeedbackProps) {
	const [freeform, setFreeform] = useState('')
	
	const isValid = freeform.trim().length >= 25
	const charCount = freeform.length
	const showError = charCount > 0 && charCount < 25
	
	const handleSubmit = () => {
		if (isValid) {
			onNext({ freeform: freeform.trim() })
		}
	}

	return (
		<div className="flex flex-col h-full">
			{/* Content section */}
			<div className="flex-1">
				{/* Title */}
				<h1 
					id="yes-step2-title"
					className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
				>
					What's one thing you wish we could've helped you with?
				</h1>
				
				{/* Helper text */}
				<p className="mt-3 text-[14px] leading-6 text-neutral-600">
					We're always looking to improve, your thoughts can help us make Migrate Mate more useful for others.
				</p>
				
				{/* Textarea field */}
				<div className="mt-5">
					<textarea
						value={freeform}
						onChange={(e) => setFreeform(e.target.value.slice(0, 500))}
						className={`w-full h-[160px] md:h-[190px] resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-6 text-neutral-900 placeholder-neutral-400 shadow-[inset_0_0_0_1px_rgba(0,0,0,0)] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${
							showError 
								? 'border-red-400 ring-2 ring-red-400/60' 
								: 'border-neutral-300'
						}`}
						placeholder=""
						aria-describedby="char-counter error-message"
					/>
					
					{/* Character counter */}
					<div className="mt-1 flex justify-end">
						<span id="char-counter" className="text-xs text-neutral-500">
							Min 25 characters ({charCount}/25)
						</span>
					</div>
					
					{/* Error message */}
					{showError && (
						<p id="error-message" className="mt-1 text-sm text-red-600">
							Please enter at least 25 characters so we can understand your feedback.
						</p>
					)}
				</div>
			</div>
			
			{/* Button section */}
			<div className="mt-5">
				<button
					onClick={handleSubmit}
					disabled={!isValid}
					className={`w-full h-12 rounded-xl font-semibold transition-all ${
						isValid
							? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50'
							: 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
					}`}
				>
					Continue
				</button>
			</div>
		</div>
	)
}


