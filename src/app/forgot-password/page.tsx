import type { Metadata } from 'next';
import AuthFrame from '@/app/auth/AuthFrame';
import AuthForm from '@/app/auth/AuthForm';

export const metadata: Metadata = { title: 'Reset your password | KeepCoding' };

export default function ForgotPasswordPage() {
  return <AuthFrame mode="reset"><AuthForm mode="forgot" /></AuthFrame>;
}
