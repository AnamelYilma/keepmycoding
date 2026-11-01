import Link from 'next/link';
import type { Metadata } from 'next';
import AuthFrame from '../AuthFrame';

export const metadata: Metadata = { title: 'Email link expired | KeepCoding' };

export default function AuthLinkErrorPage() {
  return <AuthFrame mode="login">
    <div className="auth-form-heading">
      <p className="auth-eyebrow"><i /> EMAIL LINK</p>
      <h2>This link can’t be used.</h2>
      <p>It may have expired or already been used. Request a fresh reset link, or sign in if you already confirmed your email.</p>
    </div>
    <div className="auth-form auth-link-actions">
      <Link className="auth-submit" href="/forgot-password"><span>Request a new link</span></Link>
      <Link className="auth-link-secondary" href="/login">Back to sign in</Link>
    </div>
  </AuthFrame>;
}
