'use client'

import { useState } from 'react'

interface J3VisaProps {
	onFinish: (data: { employer_immigration_support: 'yes' | 'no'; visa_type?: string }) => void
	onBack: () => void
}

export default function J3Visa({ onFinish, onBack }: J3VisaProps) {
	const [employerSupport, setEmployerSupport] = useState<'yes' | 'no' | null>(null)
	const [visaType, setVisaType] = useState('')
	
	const isValid = employerSupport !== null
	
	const handleSubmit = () => {
		if (isValid && employerSupport) {
			// Save the data and complete the cancellation
			onFinish({
				employer_immigration_support: employerSupport,
				visa_type: visaType.trim() || undefined
			})
		}
	}

	const handleRadioChange = (value: 'yes' | 'no') => {
		setEmployerSupport(value)
		// Clear visa type when changing radio selection
		if (value !== employerSupport) {
			setVisaType('')
		}
	}

	return (
		<div className="flex flex-col h-full">
			{/* Content section */}
			<div className="flex-1">
				{/* Title */}
				<h1 
					id="visa-step-title"
					className="text-[28px] md:text-[32px] leading-tight font-semibold text-neutral-900"
				>
					We helped you land the job, now let's help you secure your visa.
				</h1>
				
				{/* Radio group */}
				<fieldset className="mt-6">
					<legend className="mt-1 text-base font-medium text-neutral-900">
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
				
				{/* Conditional content based on selection */}
				{employerSupport === 'yes' && (
					<div className="mt-6">
						<label htmlFor="visa-type-yes" className="block text-[14px] leading-6 text-neutral-600">
							What visa will you be applying for?
						</label>
						<input
							id="visa-type-yes"
							type="text"
							value={visaType}
							onChange={(e) => setVisaType(e.target.value)}
							placeholder="E.g., E-3, H-1B"
							className="mt-3 w-full h-11 rounded-xl border border-neutral-300 bg-white px-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
						/>
					</div>
				)}
				
				{employerSupport === 'no' && (
					<div className="mt-6">
						<p className="text-[14px] leading-6 text-neutral-600">
							We can connect you with one of our trusted partners.
						</p>
						<label htmlFor="visa-type-no" className="block mt-4 text-[14px] leading-6 text-neutral-600">
							Which visa would you like to apply for?
						</label>
						<input
							id="visa-type-no"
							type="text"
							value={visaType}
							onChange={(e) => setVisaType(e.target.value)}
							placeholder="E.g., E-3, H-1B"
							className="mt-3 w-full h-11 rounded-xl border border-neutral-300 bg-white px-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
						/>
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