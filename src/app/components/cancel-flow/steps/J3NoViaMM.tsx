'use client'

import { useState } from 'react'

interface J3NoViaMM {
	onFinish: (data: { employer_immigration_support: 'yes' | 'no'; visa_type?: string }) => void
	onBack: () => void
	onYesSelected?: () => void
}

export default function J3NoViaMM({ onFinish, onBack, onYesSelected }: J3NoViaMM) {
	const [employerSupport, setEmployerSupport] = useState<'yes' | 'no' | null>(null)
	const [visaType, setVisaType] = useState('')
	const [showError, setShowError] = useState(false)
	
	const isValid = employerSupport !== null && (employerSupport === 'yes' || (employerSupport === 'no' && visaType.trim().length > 0))
	
	const handleSubmit = () => {
		if (employerSupport === 'no' && !visaType.trim()) {
			setShowError(true)
			return
		}
		
		if (isValid && employerSupport) {
			onFinish({
				employer_immigration_support: employerSupport,
				visa_type: visaType.trim() || undefined
			})
		}
	}

	const handleRadioChange = (value: 'yes' | 'no') => {
		setEmployerSupport(value)
		setShowError(false)
		if (value !== employerSupport) {
			setVisaType('')
		}
		
		// When Yes is selected, route to the lawyer Yes component
		if (value === 'yes' && onYesSelected) {
			onYesSelected()
		}
	}

	const handleVisaTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVisaType(e.target.value)
		if (e.target.value.trim()) {
			setShowError(false)
		}
	}

	return (
		<div className="flex flex-col h-full">
			{/* Content section */}
			<div className="flex-1">
				{/* Title - Two lines */}
				<h1 
					id="visa-step-title"
					className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
				>
					You landed the job!
					<br />
					<span className="italic">That's what we live for.</span>
				</h1>
				
				{/* Subcopy */}
				<p className="mt-2 text-[14px] leading-6 text-neutral-600">
					Even if it wasn't through MigrateMate, let us help get your visa sorted.
				</p>
				
				{/* Radio group */}
				<fieldset className="mt-4">
					<legend className="text-base font-medium text-neutral-900">
						Is your company providing an immigration lawyer to help with your visa?
					</legend>
					
					<div className="mt-3 space-y-3">
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="radio"
								name="employer-support"
								value="yes"
								checked={employerSupport === 'yes'}
								onChange={() => handleRadioChange('yes')}
								className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400/50"
							/>
							<span className="text-[15px] text-neutral-900">Yes</span>
						</label>
						
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="radio"
								name="employer-support"
								value="no"
								checked={employerSupport === 'no'}
								onChange={() => handleRadioChange('no')}
								className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-400/50"
							/>
							<span className="text-[15px] text-neutral-900">No</span>
						</label>
					</div>
				</fieldset>
				
				{/* Conditional content when No is selected */}
				{employerSupport === 'no' && (
					<div className="mt-3">
						<p className="text-[13px] leading-6 text-neutral-600">
							We can connect you with one of our trusted partners.
						</p>
						
						<label htmlFor="visa-type" className="block mt-3 text-[14px] leading-6 text-neutral-600">
							Which visa would you like to apply for?*
						</label>
						<input
							id="visa-type"
							type="text"
							value={visaType}
							onChange={handleVisaTypeChange}
							placeholder="E.g., E-3, H-1B"
							className={`mt-2 w-full h-11 rounded-xl border bg-white px-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${
								showError 
									? 'border-red-400 ring-2 ring-red-400/60' 
									: 'border-neutral-300'
							}`}
						/>
						
						{/* Error message */}
						{showError && (
							<p className="mt-1 text-sm text-red-600">
								Please enter your visa type.
							</p>
						)}
					</div>
				)}
			</div>
			
			{/* Button section */}
			<div className="mt-6">
				<button
					onClick={handleSubmit}
					disabled={!isValid}
					className={`h-12 w-full rounded-xl font-semibold transition-all ${
						isValid
							? 'bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400/50'
							: 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
					}`}
				>
					Complete cancellation
				</button>
			</div>
		</div>
	)
}
