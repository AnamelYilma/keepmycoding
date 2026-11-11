'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { safeDestination } from '@/lib/utils';

export type AuthActionResult = { error?: string; success?: string };

const roles = ['Web development', 'Mobile development', 'Backend development', 'Blockchain', 'Data & AI', 'DevOps', 'Other'];
const levels = ['Beginner', 'Junior', 'Intermediate', 'Senior'];
const genders = ['Female', 'Male', 'Prefer not to say'];

async function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return (configured ?? 'http://localhost:3002').replace(/\/$/, '');
}

function getText(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function authError(error: { code?: string; message?: string }, fallback: string) {
  if (error.code === 'email_not_confirmed') return 'Check your email and confirm your address before signing in.';
  if (error.code === 'invalid_credentials') return 'That email and password combination was not recognized.';
  if (error.code === 'weak_password') return 'Choose a stronger password and try again.';
  if (error.code === 'user_already_exists') return 'An account may already exist for this email. Try signing in or resetting your password.';
  if (error.code === 'over_email_send_rate_limit') return 'Too many email requests. Wait a little and try again.';
  if (error.code === 'same_password') return 'Choose a password you have not used before.';
  if (error.code === 'email_address_invalid') return 'Enter a valid email address.';
  if (error.code === 'signup_disabled') return 'Sign-ups are currently disabled.';
  if (error.message && !error.message.includes('apiKey') && !error.message.includes('token') && !error.message.includes('password')) {
    return error.message;
  }
  return fallback;
}

function configurationError(): AuthActionResult | null {
  return isSupabaseConfigured() ? null : { error: 'Account setup is not connected yet. Add the Supabase settings to enable this.' };
}

export async function signInAction(_previousState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const missing = configurationError();
  if (missing) return missing;
  const email = getText(formData, 'email').toLowerCase();
  const password = getText(formData, 'password');
  const next = safeDestination(formData.get('next') as string | null);
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: authError(error, 'We could not sign you in. Please try again.') };
  redirect(next);
}

export async function signUpAction(_previousState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const missing = configurationError();
  if (missing) return missing;

  const fullName = getText(formData, 'fullName');
  const email = getText(formData, 'email').toLowerCase();
  const password = getText(formData, 'password');
  const confirmPassword = getText(formData, 'confirmPassword');
  const role = getText(formData, 'role');
  const level = getText(formData, 'level');
  const gender = getText(formData, 'gender');
  const next = safeDestination(formData.get('next') as string | null);

  if (fullName.length < 2 || fullName.length > 80) return { error: 'Enter a name between 2 and 80 characters.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' };
  if (password !== confirmPassword) return { error: 'The passwords do not match.' };
  if (!roles.includes(role) || !levels.includes(level) || (gender && !genders.includes(gender))) {
    return { error: 'Choose a valid role and experience level.' };
  }

  const supabase = await createSupabaseServerClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      data: { full_name: fullName, developer_role: role, experience_level: level, gender: gender || null },
    },
  });

  if (error) return { error: authError(error, 'We could not create your account. Please try again.') };

  // Detect Supabase anti-enumeration empty identities for existing accounts
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: 'An account may already exist for this email. Try signing in or resetting your password.' };
  }

  if (data.session) redirect(next);

  // Attempt immediate sign-in if confirmations are disabled or auto-confirmed
  const signInRes = await supabase.auth.signInWithPassword({ email, password });
  if (signInRes.data?.session) {
    redirect(next);
  }

  return { success: 'Check your inbox for a confirmation link. Confirm your email to finish creating your account.' };
}

export async function requestPasswordResetAction(_previousState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const missing = configurationError();
  if (missing) return missing;
  const email = getText(formData, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };

  const supabase = await createSupabaseServerClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: authError(error, 'We could not send the reset email. Please try again.') };
  return { success: 'If an account exists for that email, a password reset link is on its way.' };
}

export async function updatePasswordAction(_previousState: AuthActionResult, formData: FormData): Promise<AuthActionResult> {
  const missing = configurationError();
  if (missing) return missing;
  const password = getText(formData, 'password');
  const confirmPassword = getText(formData, 'confirmPassword');
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' };
  if (password !== confirmPassword) return { error: 'The passwords do not match.' };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'This reset link is missing or expired. Request another one.' };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authError(error, 'We could not update your password. Request a fresh reset link and try again.') };
  redirect('/challenges');
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/');
}
