import type { Metadata } from 'next';
import AuthFrame from '@/app/auth/AuthFrame';
import AuthForm from '@/app/auth/AuthForm';

export const metadata: Metadata = { title: 'Create your account | KeepCoding' };

export default function SignUpPage() {
  return <AuthFrame mode="signup"><AuthForm mode="signup" /></AuthFrame>;
}
