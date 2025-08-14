import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { db } from '@/lib/db-fallback'
import { getOrSetCsrfToken, requireCsrf } from '@/lib/csrf'
import { logError, logInfo } from '@/lib/logging'
import { StartRequestSchema, Variant } from '@/lib/validation'

export async function GET() {
	// Establish CSRF cookies for client to mirror
	await getOrSetCsrfToken()
	return new NextResponse(null, { status: 204 })
}

export async function POST(req: Request) {
	// Ensure CSRF cookie exists for clients to mirror header
	await getOrSetCsrfToken()
	try {
		await requireCsrf()
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: e.status ?? 403 })
	}

	try {
		const body = await req.json()
		const parsed = StartRequestSchema.parse(body)

		// Mock session: derive user from header in dev. In real app, fetch from auth.
		const userId = req.headers.get('x-user-id') || null
		if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Verify subscription ownership and active status (Supabase or fallback)
		let subscription: any = null
		if (supabaseAdmin) {
			const { data, error } = await supabaseAdmin
				.from('subscriptions')
				.select('id, user_id, monthly_price, status')
				.eq('id', parsed.subscriptionId)
				.single()
			if (error || !data) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
			subscription = data
		} else {
			subscription = db.getSubscriptionById(parsed.subscriptionId)
			if (!subscription) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
		}
		if (subscription.user_id !== userId || subscription.status !== 'active') {
			return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
		}

		// Look for existing in-progress cancellation for this user + subscription
		let existing: any = null
		if (supabaseAdmin) {
			const { data, error: existingErr } = await supabaseAdmin
				.from('cancellations')
				.select('id, downsell_variant, status')
				.eq('user_id', userId)
				.eq('subscription_id', parsed.subscriptionId)
				.order('created_at', { ascending: false })
				.limit(1)
				.maybeSingle()
			if (existingErr) {
				await logError('cancellations lookup failed', { subscription_id: parsed.subscriptionId, user_id: userId, error: existingErr.message })
			}
			existing = data
		} else {
			existing = db.getLatestCancellation(userId, parsed.subscriptionId)
		}

		if (existing && existing.status === 'in_progress') {
			await logInfo('start resumed existing cancellation', { cancellation_id: existing.id, subscription_id: parsed.subscriptionId, user_id: userId, variant: existing.downsell_variant })
			return NextResponse.json({ cancellationId: existing.id, variant: existing.downsell_variant as Variant, planPriceCents: subscription.monthly_price })
		}

		// Assign deterministic 50/50 using crypto RNG
		const randomByte = crypto.randomBytes(1)[0]
		const variant: Variant = randomByte % 2 === 0 ? 'A' : 'B'

		// Create new cancellation
		let created: any = null
		if (supabaseAdmin) {
			const { data, error: insertErr } = await supabaseAdmin
				.from('cancellations')
				.insert({
					user_id: userId,
					subscription_id: parsed.subscriptionId,
					downsell_variant: variant,
				})
				.select('id')
				.single()
			if (insertErr || !data) {
				await logError('failed to create cancellation', { subscription_id: parsed.subscriptionId, user_id: userId, error: insertErr?.message })
				return NextResponse.json({ error: 'Failed to start cancellation' }, { status: 500 })
			}
			created = data
		} else {
			created = db.createCancellation(userId, parsed.subscriptionId, variant)
		}

		await logInfo('start created new cancellation', { cancellation_id: created.id, subscription_id: parsed.subscriptionId, user_id: userId, variant })
		return NextResponse.json({ cancellationId: created.id, variant, planPriceCents: subscription.monthly_price })
	} catch (err: any) {
		await logError('start failed', { error: err?.message })
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
	}
}


