import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { db } from '@/lib/db-fallback'
import { UuidSchema } from '@/lib/validation'
import { getOrSetCsrfToken, requireCsrf } from '@/lib/csrf'
import { logError, logInfo } from '@/lib/logging'

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	getOrSetCsrfToken()
	try {
		requireCsrf()
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: e.status ?? 403 })
	}

	try {
		const cancellationId = UuidSchema.parse(params.id)
		const userId = req.headers.get('x-user-id') || null
		if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Fetch cancellation with subscription
		let record: any = null
		if (supabaseAdmin) {
			const { data, error } = await supabaseAdmin
				.from('cancellations')
				.select('id, user_id, status, subscription_id')
				.eq('id', cancellationId)
				.single()
			if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
			record = data
		} else {
			record = db.getCancellationById(cancellationId)
			if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
		}
		if (record.user_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

		// Idempotent: if already completed, just return ok
		if (record.status === 'completed') return NextResponse.json({ ok: true })

		// Update inside transaction-like sequence (best-effort with Supabase client)
		if (supabaseAdmin) {
			const { error: subErr } = await supabaseAdmin
				.from('subscriptions')
				.update({ status: 'pending_cancellation' })
				.eq('id', record.subscription_id)
			if (subErr) {
				logError('complete: subscription update failed', { cancellation_id: cancellationId, user_id: userId, error: subErr.message })
				return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
			}

			const { error: canErr } = await supabaseAdmin
				.from('cancellations')
				.update({ status: 'completed' })
				.eq('id', cancellationId)
			if (canErr) {
				logError('complete: cancellation update failed', { cancellation_id: cancellationId, user_id: userId, error: canErr.message })
				return NextResponse.json({ error: 'Failed to complete cancellation' }, { status: 500 })
			}
		} else {
			db.updateSubscriptionStatus(record.subscription_id, 'pending_cancellation')
			db.updateCancellation(cancellationId, { status: 'completed' })
		}

		logInfo('complete: success', { cancellation_id: cancellationId, user_id: userId })
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		logError('complete: invalid request', { error: err?.message })
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
	}
}


