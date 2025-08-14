import { cookies, headers } from 'next/headers'
import crypto from 'node:crypto'

const CSRF_COOKIE = 'csrf_token'
const CSRF_COOKIE_MIRROR = 'csrf_token_mirror'
const CSRF_HEADER = 'x-csrf-token'

export function getOrSetCsrfToken(): string {
	const store = cookies()
	const existing = store.get(CSRF_COOKIE)?.value
	if (existing) {
		// Ensure mirror exists too
		if (!store.get(CSRF_COOKIE_MIRROR)) {
			store.set(CSRF_COOKIE_MIRROR, existing, {
				httpOnly: false,
				sameSite: 'lax',
				path: '/',
			})
		}
		return existing
	}
	const token = crypto.randomBytes(32).toString('hex')
	store.set(CSRF_COOKIE, token, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
	})
	// Mirror readable cookie for client-side header reflection
	store.set(CSRF_COOKIE_MIRROR, token, {
		httpOnly: false,
		sameSite: 'lax',
		path: '/',
	})
	return token
}

export function requireCsrf(): void {
	const store = cookies()
	const hdrs = headers()
	const cookieToken = store.get(CSRF_COOKIE)?.value
	const headerToken = hdrs.get(CSRF_HEADER)
	if (!cookieToken || !headerToken || cookieToken !== headerToken) {
		throw Object.assign(new Error('Forbidden: invalid CSRF token'), {
			status: 403,
		})
	}
}

export function csrfHeaderName(): string {
	return CSRF_HEADER
}


