'use client'

import { useState } from 'react'

type FormData = {
	foundViaMigrateMate: boolean | null
	rolesApplied: string | null
	companiesEmailed: string | null
	companiesInterviewed: string | null
}

export default function J1Congrats({ onNext, onBack }: { onNext: (foundViaUs: boolean, formData: FormData) => void; onBack: () => void }) {
	const [formData, setFormData] = useState<FormData>({
		foundViaMigrateMate: null,
		rolesApplied: null,
		companiesEmailed: null,
		companiesInterviewed: null
	})

	const isValid = formData.foundViaMigrateMate !== null && 
		formData.rolesApplied !== null && 
		formData.companiesEmailed !== null && 
		formData.companiesInterviewed !== null

	const handleSubmit = () => {
		if (isValid && formData.foundViaMigrateMate !== null) {
			onNext(formData.foundViaMigrateMate, formData)
		}
	}

	return (
		<div className="font-sans flex flex-col h-full justify-between">
			<div className="flex-1">
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
					Congrats on the new role! 🎉
				</h1>

				<div className="space-y-6">
					{/* Question 1 */}
					<div>
						<p className="text-lg font-semibold text-gray-900 mb-3 tracking-wide">
							Did you find this job with MigrateMate?<span className="text-red-500">*</span>
						</p>
						<div className="flex gap-3">
							{['Yes', 'No'].map((option, idx) => (
								<button
									key={option}
									onClick={() => setFormData({ ...formData, foundViaMigrateMate: idx === 0 })}
									className={`px-6 py-2.5 rounded-full border transition-all font-medium tracking-wide ${
										formData.foundViaMigrateMate === (idx === 0)
											? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
											: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>

					{/* Question 2 */}
					<div>
						<p className="text-lg font-semibold text-gray-900 mb-3 tracking-wide">
							How many roles did you <u>apply</u> for through Migrate Mate?<span className="text-red-500">*</span>
						</p>
						<div className="flex gap-3">
							{['0', '1-5', '6-20', '20+'].map((option) => (
								<button
									key={option}
									onClick={() => setFormData({ ...formData, rolesApplied: option })}
									className={`px-6 py-2.5 rounded-full border transition-all font-medium tracking-wide ${
										formData.rolesApplied === option
											? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
											: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>

					{/* Question 3 */}
					<div>
						<p className="text-lg font-semibold text-gray-900 mb-3 tracking-wide">
							How many companies did you <u>email</u> directly?<span className="text-red-500">*</span>
						</p>
						<div className="flex gap-3">
							{['0', '1-5', '6-20', '20+'].map((option) => (
								<button
									key={option}
									onClick={() => setFormData({ ...formData, companiesEmailed: option })}
									className={`px-6 py-2.5 rounded-full border transition-all font-medium tracking-wide ${
										formData.companiesEmailed === option
											? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
											: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>

					{/* Question 4 */}
					<div>
						<p className="text-lg font-semibold text-gray-900 mb-3 tracking-wide">
							How many different companies did you <u>interview</u> with?<span className="text-red-500">*</span>
						</p>
						<div className="flex gap-3">
							{['0', '1-2', '3-5', '5+'].map((option) => (
								<button
									key={option}
									onClick={() => setFormData({ ...formData, companiesInterviewed: option })}
									className={`px-6 py-2.5 rounded-full border transition-all font-medium tracking-wide ${
										formData.companiesInterviewed === option
											? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
											: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6">
				<button
					onClick={handleSubmit}
					disabled={!isValid}
					className={`w-full h-12 rounded-xl font-semibold tracking-wide transition-all shadow-md ${
						isValid
							? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
							: 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
					}`}
				>
					Continue
				</button>
			</div>
		</div>
	)
}


