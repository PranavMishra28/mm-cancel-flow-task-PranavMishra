import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { db } from '@/lib/db-fallback'
import { PatchRequestSchema, UuidSchema, coerceWillingToPayCents } from '@/lib/validation'
import { getOrSetCsrfToken, requireCsrf } from '@/lib/csrf'
import { logError, logInfo } from '@/lib/logging'

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	await getOrSetCsrfToken()
	try {
		await requireCsrf()
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: e.status ?? 403 })
	}

	try {
		const cancellationId = UuidSchema.parse(params.id)
		const body = await req.json()
		const parsed = PatchRequestSchema.parse(body)

		const userId = req.headers.get('x-user-id') || null
		if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Load target cancellation and verify ownership + not completed
		let target: any = null
		if (supabaseAdmin) {
			const { data, error: loadErr } = await supabaseAdmin
				.from('cancellations')
				.select('id, user_id, status')
				.eq('id', cancellationId)
				.single()
			if (loadErr || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
			target = data
		} else {
			target = db.getCancellationById(cancellationId)
			if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
		}
		if (target.user_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		if (target.status === 'completed') return NextResponse.json({ error: 'Invalid state' }, { status: 400 })

		// Prepare update payload according to allowed fields
		const willingToPayCents = coerceWillingToPayCents(parsed)
		const update: Record<string, unknown> = {}
		if (parsed.found_job !== undefined) update.found_job = parsed.found_job
		if (parsed.found_via_migratemate !== undefined)
			update.found_via_migratemate = parsed.found_via_migratemate
		if (parsed.visa_type !== undefined) update.visa_type = parsed.visa_type
		if (parsed.freeform_feedback !== undefined)
			update.freeform_feedback = parsed.freeform_feedback
		if (parsed.reason_key !== undefined) update.reason_key = parsed.reason_key
		if (parsed.employer_immigration_support !== undefined) update.employer_immigration_support = parsed.employer_immigration_support
		if (willingToPayCents !== undefined) update.willing_to_pay_cents = willingToPayCents

		if (supabaseAdmin) {
			const { error: upErr } = await supabaseAdmin
				.from('cancellations')
				.update(update)
				.eq('id', cancellationId)
			if (upErr) {
				await logError('patch update failed', { cancellation_id: cancellationId, user_id: userId, error: upErr.message })
				return NextResponse.json({ error: 'Update failed' }, { status: 500 })
			}
		} else {
			db.updateCancellation(cancellationId, update)
		}

		await logInfo('patch updated cancellation', { cancellation_id: cancellationId, user_id: userId })
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		await logError('patch payload invalid', { error: err?.message })
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
	}
}


