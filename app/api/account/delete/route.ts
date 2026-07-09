import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'

export const maxDuration = 15

/**
 * DELETE ACCOUNT — permanently removes the signed-in user and their data.
 *
 * Request:  POST /api/account/delete
 *           Header  Authorization: Bearer <supabase access_token>
 *           (no body)
 * Response: 200 { ok: true }
 *           401 { ok: false, error: 'no_token' | 'invalid_token' }
 *           503 { ok: false, error: 'unavailable' }   (service key not configured)
 *           500 { ok: false, error: 'delete_failed' }
 *
 * Security: the user is resolved from their own access token, so a caller can only
 * delete their own account. Deleting the auth user cascades to carts/wishlists via
 * their ON DELETE CASCADE foreign keys (Ley 1581 / Habeas Data: right to erasure).
 */
export async function POST(req: NextRequest) {
  const auth  = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) return NextResponse.json({ ok: false, error: 'no_token' }, { status: 401 })

  const admin = getAdminClient()
  if (!admin) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  // Validate the token and get the user it belongs to.
  const { data: { user }, error: userErr } = await admin.auth.getUser(token)
  if (userErr || !user) return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 401 })

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return NextResponse.json({ ok: false, error: 'delete_failed' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
