// Extremely simple in-memory fallback for local dev without Supabase.
// Not for production use.

export type Subscription = {
	id: string
	user_id: string
	monthly_price: number
	status: 'active' | 'pending_cancellation' | 'cancelled'
}

export type Cancellation = {
	id: string
	user_id: string
	subscription_id: string
	downsell_variant: 'A' | 'B'
	status: 'in_progress' | 'completed'
	accepted_downsell?: boolean
	found_job?: boolean
	found_via_migratemate?: boolean
	visa_type?: string | null
	freeform_feedback?: string | null
	reason_key?: string | null
	willing_to_pay_cents?: number | null
	employer_immigration_support?: 'yes' | 'no' | null
	created_at: string
}

const subscriptions = new Map<string, Subscription>()
const cancellations = new Map<string, Cancellation>()

// Seed minimal data
const seedUser = '550e8400-e29b-41d4-a716-446655440001'
const seedSub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
subscriptions.set(seedSub, {
	id: seedSub,
	user_id: seedUser,
	monthly_price: 2500,
	status: 'active',
})

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

export const db = {
	getSubscriptionById(id: string) {
		return subscriptions.get(id) || null
	},
	getLatestCancellation(userId: string, subscriptionId: string) {
		const list = Array.from(cancellations.values())
			.filter((c) => c.user_id === userId && c.subscription_id === subscriptionId)
			.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
		return list[0] || null
	},
	createCancellation(userId: string, subscriptionId: string, variant: 'A' | 'B') {
		const id = uuid()
		cancellations.set(id, {
			id,
			user_id: userId,
			subscription_id: subscriptionId,
			downsell_variant: variant,
			status: 'in_progress',
			created_at: new Date().toISOString(),
		})
		return { id }
	},
	getCancellationById(id: string) {
		return cancellations.get(id) || null
	},
	updateCancellation(id: string, changes: Partial<Cancellation>) {
		const existing = cancellations.get(id)
		if (!existing) return null
		const next = { ...existing, ...changes }
		cancellations.set(id, next)
		return next
	},
	updateSubscriptionStatus(id: string, status: Subscription['status']) {
		const sub = subscriptions.get(id)
		if (!sub) return null
		subscriptions.set(id, { ...sub, status })
		return true
	},
}


