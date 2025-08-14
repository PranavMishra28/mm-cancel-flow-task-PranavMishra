import { z } from 'zod'

// Shared enums and bounds
export const ReasonKeySchema = z.enum([
	'too_expensive',
	'not_finding_roles',
	'hired_elsewhere',
	'product_issues',
	'temporary_break',
	'other',
])

export type ReasonKey = z.infer<typeof ReasonKeySchema>

export const VariantSchema = z.enum(['A', 'B'])
export type Variant = z.infer<typeof VariantSchema>

export const UuidSchema = z
	.string()
	.uuid({ message: 'Must be a valid UUID' })

// Request schemas
export const StartRequestSchema = z.object({
	subscriptionId: UuidSchema,
})
export type StartRequest = z.infer<typeof StartRequestSchema>

// PATCH payload: one or more fields allowed
export const PatchRequestSchema = z
	.object({
		found_job: z.boolean().optional(),
		found_via_migratemate: z.boolean().optional(),
		visa_type: z
			.string()
			.trim()
			.min(1, { message: 'Visa type is required' })
			.max(80)
			.nullable()
			.optional(),
		freeform_feedback: z
			.string()
			.trim()
			.max(1000)
			.nullable()
			.optional(),
		reason_key: ReasonKeySchema.optional(),
		employer_immigration_support: z.enum(['yes', 'no']).optional(),
		// Client may send dollars; server stores cents
		willing_to_pay_dollars: z
			.number()
			.int()
			.min(0)
			.max(500)
			.optional(),
		willing_to_pay_cents: z
			.number()
			.int()
			.min(0)
			.max(50000)
			.optional(),
	})
	.strict()
	.refine(
		(data) => {
			return (
				data.found_job !== undefined ||
				data.found_via_migratemate !== undefined ||
				data.visa_type !== undefined ||
				data.freeform_feedback !== undefined ||
				data.reason_key !== undefined ||
				data.willing_to_pay_dollars !== undefined ||
				data.willing_to_pay_cents !== undefined
			)
		},
		{ message: 'At least one field must be provided' },
	)

export type PatchRequest = z.infer<typeof PatchRequestSchema>

export const CompleteRequestSchema = z.object({}).strict()
export type CompleteRequest = z.infer<typeof CompleteRequestSchema>

export const DownsellAcceptRequestSchema = z.object({}).strict()
export type DownsellAcceptRequest = z.infer<typeof DownsellAcceptRequestSchema>

// Helpers
export function dollarsToCents(dollars: number): number {
	return Math.round(dollars * 100)
}

export function coerceWillingToPayCents(
	data: PatchRequest,
): number | undefined {
	if (typeof data.willing_to_pay_cents === 'number') return data.willing_to_pay_cents
	if (typeof data.willing_to_pay_dollars === 'number') return dollarsToCents(data.willing_to_pay_dollars)
	return undefined
}


