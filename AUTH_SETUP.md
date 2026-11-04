# Supabase Auth setup

The app's account screens and auth callbacks are implemented. They need project settings before Supabase can create accounts or send email.

## App environment

Copy `.env.example` to `.env.local`, then set:

- `NEXT_PUBLIC_SUPABASE_URL`: the project's URL from Supabase API settings.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key. Do not use a service-role key here.
- `NEXT_PUBLIC_SITE_URL`: the exact site origin, such as `http://localhost:3000` locally and the deployed HTTPS origin in production.

Restart the Next.js server after changing environment values.

## Supabase Auth settings

1. Enable email and password sign-in. To open registration for all users immediately without waiting for confirmation emails or hitting free-tier email rate limits (AUTH-02), toggle **Confirm email** to **OFF** in Supabase under `Authentication -> Providers -> Email`.
2. Set the Auth Site URL to `NEXT_PUBLIC_SITE_URL`.
3. Add local and deployed callback destinations to the Auth redirect URL allowlist: `http://localhost:3000/auth/callback` and `https://YOUR_DOMAIN/auth/callback`.
4. Keep the confirmation email link on the app callback if email confirmation is enabled. The callback supports both Supabase's PKCE `code` and token-hash links.
5. Keep password recovery links on the callback with `next=/reset-password`; the app exchanges the link and then presents the new-password form.
6. Configure custom SMTP before launch if email confirmation is required. Supabase's built-in sender is rate-limited and intended for trying the flow, not production email delivery.

Sign-up stores `full_name`, `developer_role`, `experience_level`, and optional `gender` as Supabase auth user metadata. They are profile preferences, not authorization roles. No separate profile table is required for this first version.
