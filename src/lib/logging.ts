import { headers } from 'next/headers'
import { randomUUID } from 'node:crypto'

type LogLevel = 'info' | 'warn' | 'error'

async function baseFields() {
	const hdrs = await headers()
	const correlationId = hdrs.get('x-correlation-id') ?? randomUUID()
	return { correlation_id: correlationId }
}

async function emit(level: LogLevel, message: string, fields: Record<string, unknown> = {}) {
	const base = await baseFields()
	const payload = { level, message, ...base, ...fields, ts: new Date().toISOString() }
	// eslint-disable-next-line no-console
	console[level === 'info' ? 'log' : level](JSON.stringify(payload))
}

export async function logInfo(message: string, fields: Record<string, unknown> = {}) { await emit('info', message, fields) }
export async function logWarn(message: string, fields: Record<string, unknown> = {}) { await emit('warn', message, fields) }
export async function logError(message: string, fields: Record<string, unknown> = {}) { await emit('error', message, fields) }


