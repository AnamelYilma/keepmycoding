import type { Metadata } from 'next';
import AuthFrame from '@/app/auth/AuthFrame';
import AuthForm from '@/app/auth/AuthForm';

export const metadata: Metadata = { title: 'Sign in | KeepCoding' };

export default function LoginPage() {
  return <AuthFrame mode="login"><AuthForm mode="login" /></AuthFrame>;
}
