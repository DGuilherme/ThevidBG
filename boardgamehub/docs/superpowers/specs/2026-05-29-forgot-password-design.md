# Forgot Password — Design Spec

**Date:** 2026-05-29  
**Status:** Approved

---

## Overview

Add a standard forgot-password flow to BoardGameHub. The user requests a reset link via email, receives a time-limited link, and sets a new password through that link. The feature integrates with the existing custom auth (bcrypt + iron-session) and uses Nodemailer to send email via the SMTP server hosted on Coolify.

---

## User Flow

```
/forgot-password
  → user enters email
  → server action: generate token, store hash in DB, send email
  → always shows success message (no user enumeration)

email with link → /reset-password?token=<raw-token>
  → validate token (exists, not used, not expired)
  → user enters new password
  → server action: hash new password, update user, mark token used
  → redirect /login with success message
```

---

## Database

### New table: `password_reset_tokens`

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK | `defaultRandom()` |
| `user_id` | `uuid` FK → `users.id` CASCADE DELETE | |
| `token_hash` | `text` UNIQUE NOT NULL | SHA-256 hex of raw token |
| `expires_at` | `timestamp with tz` NOT NULL | 1 hour after creation |
| `used_at` | `timestamp with tz` nullable | null = still valid |

Token generation: `crypto.randomBytes(32)` → 64-char hex string (raw token, sent in email).  
Storage: `SHA-256(rawToken)` hex — the DB never holds the usable value.

---

## Files

### New files

| file | purpose |
|---|---|
| `lib/email.ts` | Nodemailer transporter, `sendPasswordResetEmail()` |
| `lib/db/mutations/password-reset.ts` | `createResetToken()`, `findValidToken()`, `consumeToken()` |
| `app/actions/password-reset.ts` | Server actions: `requestReset`, `resetPassword` |
| `app/(auth)/forgot-password/page.tsx` | Page for the email request form |
| `components/auth/ForgotPasswordForm.tsx` | Form component (useActionState) |
| `app/(auth)/reset-password/page.tsx` | Page for the new-password form |
| `components/auth/ResetPasswordForm.tsx` | Form component (useActionState) |

### Modified files

| file | change |
|---|---|
| `lib/db/schema.ts` | Add `password_reset_tokens` Drizzle table + inferred types |
| `drizzle/schema.sql` | Add DDL for `password_reset_tokens` |
| `app/(auth)/login/page.tsx` | Add "Forgot password?" link below the login form |

---

## Environment Variables

Add to Coolify:

```
SMTP_HOST      # e.g. mail.yourdomain.com
SMTP_PORT      # e.g. 587 (STARTTLS) or 465 (SSL)
SMTP_USER      # SMTP username / email address
SMTP_PASS      # SMTP password
SMTP_FROM      # From address, e.g. "BoardGameHub <noreply@yourdomain.com>"
APP_URL        # Public base URL, e.g. https://boardgamehub.theviddev.org
```

---

## Security

- Token is `crypto.randomBytes(32)` — 256 bits of entropy, cryptographically secure.
- Only the SHA-256 hash is stored in the DB. A DB leak does not expose usable tokens.
- Token expires in **1 hour**.
- `used_at` is set on first use — tokens are single-use.
- `requestReset` always returns the same response regardless of whether the email exists, preventing user enumeration.
- Token validated server-side on every action call — not just page load.

---

## Error States

| state | handling |
|---|---|
| Email not found | Silent success (no enumeration) |
| Token expired | Show "Link expirado, pede um novo" |
| Token already used | Show "Link já utilizado, pede um novo" |
| Token not found | Show "Link inválido" |
| SMTP failure | Log error server-side, return generic error to user |

---

## Out of Scope

- Rate limiting per email (can be added later to `password_reset_tokens`)
- Admin-triggered password resets
- Magic-link login (separate feature)
