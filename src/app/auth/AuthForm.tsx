'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { requestPasswordResetAction, signInAction, signUpAction, updatePasswordAction, type AuthActionResult } from './actions';

type AuthMode = 'signup' | 'login' | 'forgot' | 'reset';
const initialState: AuthActionResult = {};
const roles = ['Web development', 'Mobile development', 'Backend development', 'Blockchain', 'Data & AI', 'DevOps', 'Other'];
const levels = ['Beginner', 'Junior', 'Intermediate', 'Senior'];

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const action = mode === 'signup' ? signUpAction : mode === 'login' ? signInAction : mode === 'forgot' ? requestPasswordResetAction : updatePasswordAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === 'signup';
  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot';
  const isReset = mode === 'reset';

  const title = isSignup ? 'Make this practice yours.' : isLogin ? 'Pick up where you left off.' : isForgot ? 'Get back into your account.' : 'Choose a new password.';
  const description = isSignup ? 'A few details help us start you on the right kind of challenge.' : isLogin ? 'Sign in to continue to your practice setup.' : isForgot ? 'Enter the email you used to sign up. We’ll send a reset link if there’s an account for it.' : 'Use at least 8 characters. Your new password will replace the old one.';
  const hasSuccess = Boolean(state.success);

  return (
    <>
      {!isSignup && <div className="auth-form-heading">
        <p className="auth-eyebrow"><i /> {isSignup ? 'CREATE YOUR ACCOUNT' : isLogin ? 'WELCOME BACK' : isForgot ? 'PASSWORD RECOVERY' : 'SET NEW PASSWORD'}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>}

      {isLogin && <ol className="auth-practice-sequence" aria-label="The KeepCoding practice loop">
        <li><span>01</span><strong>Read</strong></li>
        <li><span>02</span><strong>Write</strong></li>
        <li><span>03</span><strong>Review</strong></li>
      </ol>}

      {state.error && <div className="auth-feedback auth-feedback--error" role="alert">{state.error}</div>}
      {state.success && <div className="auth-feedback auth-feedback--success" role="status"><Check size={17} aria-hidden="true"/><span>{state.success}</span></div>}

      {!hasSuccess && <form className={`auth-form${isSignup ? ' auth-form--signup' : ''}`} action={formAction}>
        {isSignup && <>
          <label className="auth-field"><span>Full name</span><input name="fullName" type="text" autoComplete="name" placeholder="Your name" minLength={2} maxLength={80} required /></label>
          <div className="auth-field-row">
            <label className="auth-field"><span>I work mostly in</span><select name="role" defaultValue="" required><option value="" disabled>Select a role</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
            <label className="auth-field"><span>Experience level</span><select name="level" defaultValue="" required><option value="" disabled>Select a level</option>{levels.map((level) => <option key={level}>{level}</option>)}</select></label>
          </div>
          <label className="auth-field auth-field--optional"><span>Gender <small>OPTIONAL</small></span><select name="gender" defaultValue="Prefer not to say"><option>Prefer not to say</option><option>Female</option><option>Male</option></select></label>
        </>}

        {(isSignup || isLogin || isForgot) && <label className="auth-field"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required /></label>}

        {(isSignup || isLogin || isReset) && <label className="auth-field"><span>{isReset ? 'New password' : 'Password'}{isLogin && <Link href="/forgot-password">Forgot password?</Link>}</span><div className="auth-password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : isReset ? 'new-password' : 'new-password'} minLength={8} placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'} required /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}

        {(isSignup || isReset) && <label className="auth-field"><span>Confirm password</span><input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} placeholder="Enter it again" required /></label>}

        <button className="auth-submit" type="submit" disabled={pending}>
          <span>{pending ? 'Please wait…' : isSignup ? 'Create account' : isLogin ? 'Sign in' : isForgot ? 'Send reset link' : 'Update password'}</span>
          {!pending && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>}

      <div className={`auth-switch${isSignup || isLogin ? ' auth-switch--prominent' : ''}`}>
        {isSignup && <Link className="auth-switch-card" href="/login"><span>ALREADY HAVE AN ACCOUNT?</span><strong>Sign in to practice <ArrowRight size={17} aria-hidden="true" /></strong></Link>}
        {isLogin && <Link className="auth-switch-card" href="/signup"><span>NEW TO KEEPCODING?</span><strong>Create your account <ArrowRight size={17} aria-hidden="true" /></strong></Link>}
        {isForgot && <>Remembered your password? <Link href="/login">Back to sign in</Link></>}
        {isReset && <>Need a fresh link? <Link href="/forgot-password">Request another reset</Link></>}
      </div>
    </>
  );
}
