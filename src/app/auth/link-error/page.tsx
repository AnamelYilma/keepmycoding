import Link from 'next/link';
import type { Metadata } from 'next';
import { AlertCircle, ArrowRight } from 'lucide-react';
import AuthFrame from '../AuthFrame';

export const metadata: Metadata = { title: 'Email link expired | KeepCoding' };

export default function AuthLinkErrorPage() {
  return (
    <AuthFrame mode="login">
      <div className="auth-form-heading">
        <p className="auth-eyebrow">
          <AlertCircle size={14} aria-hidden="true" />
          <span>EMAIL LINK EXPIRED</span>
        </p>
        <h2>This link cannot be used.</h2>
        <p>
          The verification link has expired or has already been used. You can request a fresh reset
          link, or sign in if your account is already active.
        </p>
      </div>
      <div className="auth-form auth-link-actions">
        <Link className="auth-submit" href="/forgot-password">
          <span>Request a new link</span>
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link className="auth-link-secondary" href="/login">
          Back to sign in
        </Link>
      </div>
    </AuthFrame>
  );
}
