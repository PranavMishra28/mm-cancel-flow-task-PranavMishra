import { headers } from 'next/headers'
import { randomUUID } from 'node:crypto'

type LogLevel = 'info' | 'warn' | 'error'

function baseFields() {
	const hdrs = headers()
	const correlationId = hdrs.get('x-correlation-id') ?? randomUUID()
	return { correlation_id: correlationId }
}

function emit(level: LogLevel, message: string, fields: Record<string, unknown> = {}) {
	const payload = { level, message, ...baseFields(), ...fields, ts: new Date().toISOString() }
	// eslint-disable-next-line no-console
	console[level === 'info' ? 'log' : level](JSON.stringify(payload))
}

export function logInfo(message: string, fields: Record<string, unknown> = {}) {
	emit('info', message, fields)
}

export function logWarn(message: string, fields: Record<string, unknown> = {}) {
	emit('warn', message, fields)
}

export function logError(message: string, fields: Record<string, unknown> = {}) {
	emit('error', message, fields)
}


