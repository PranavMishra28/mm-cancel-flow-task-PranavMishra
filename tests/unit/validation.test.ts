import { describe, it, expect } from 'vitest'
import { PatchRequestSchema, StartRequestSchema, dollarsToCents, coerceWillingToPayCents } from '@/lib/validation'

describe('validation', () => {
	it('validates start request', () => {
		expect(() => StartRequestSchema.parse({ subscriptionId: '550e8400-e29b-41d4-a716-446655440001' })).not.toThrow()
	})

	it('rejects empty patch', () => {
		expect(() => PatchRequestSchema.parse({})).toThrow()
	})

	it('coerces willing to pay dollars to cents', () => {
		expect(dollarsToCents(19)).toBe(1900)
		expect(coerceWillingToPayCents({ willing_to_pay_dollars: 10 } as any)).toBe(1000)
		expect(coerceWillingToPayCents({ willing_to_pay_cents: 2500 } as any)).toBe(2500)
	})
})


