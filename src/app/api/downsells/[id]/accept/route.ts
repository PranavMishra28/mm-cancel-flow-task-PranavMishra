import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { UuidSchema } from '@/lib/validation'
import { getOrSetCsrfToken, requireCsrf } from '@/lib/csrf'
import { logError, logInfo } from '@/lib/logging'
import { db } from '@/lib/db-fallback'

export async function POST(
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
		const userId = req.headers.get('x-user-id') || null
		if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		let record: any = null
		if (supabaseAdmin) {
			const { data, error } = await supabaseAdmin
				.from('cancellations')
				.select('id, user_id, accepted_downsell')
				.eq('id', cancellationId)
				.single()
			if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
			record = data
		} else {
			record = db.getCancellationById(cancellationId)
			if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
		}
		if (record.user_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

		if (record.accepted_downsell) return NextResponse.json({ ok: true })

		if (supabaseAdmin) {
			const { error: upErr } = await supabaseAdmin
				.from('cancellations')
				.update({ accepted_downsell: true })
				.eq('id', cancellationId)
			if (upErr) {
				await logError('downsells.accept: update failed', { cancellation_id: cancellationId, user_id: userId, error: upErr.message })
				return NextResponse.json({ error: 'Failed to accept offer' }, { status: 500 })
			}
		} else {
			db.updateCancellation(cancellationId, { accepted_downsell: true })
		}

		await logInfo('downsells.accept: success', { cancellation_id: cancellationId, user_id: userId })
		return NextResponse.json({ ok: true })
	} catch (err: any) {
		await logError('downsells.accept: invalid request', { error: err?.message })
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
	}
}


