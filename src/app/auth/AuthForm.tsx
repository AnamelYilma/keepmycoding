'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
  type AuthActionResult,
} from './actions';

type AuthMode = 'signup' | 'login' | 'forgot' | 'reset';
const initialState: AuthActionResult = {};
const roles = [
  'Web development',
  'Mobile development',
  'Backend development',
  'Blockchain',
  'Data & AI',
  'DevOps',
  'Other',
];
const levels = ['Beginner', 'Junior', 'Intermediate', 'Senior'];

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const action =
    mode === 'signup'
      ? signUpAction
      : mode === 'login'
      ? signInAction
      : mode === 'forgot'
      ? requestPasswordResetAction
      : updatePasswordAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === 'signup';
  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot';
  const isReset = mode === 'reset';

  const title = isSignup
    ? 'Make this practice yours.'
    : isLogin
    ? 'Pick up where you left off.'
    : isForgot
    ? 'Get back into your account.'
    : 'Choose a new password.';

  const description = isSignup
    ? 'A few details help calibrate the right challenge difficulty for you.'
    : isLogin
    ? 'Sign in to access your practice workspace and challenge history.'
    : isForgot
    ? 'Enter the email you used to sign up. We will send a reset link if an account exists.'
    : 'Use at least 8 characters. Your new password will securely replace the old one.';

  const hasSuccess = Boolean(state.success);

  return (
    <>
      <div className="auth-form-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {state.error && (
        <div className="auth-feedback auth-feedback--error" role="alert">
          <AlertCircle size={16} className="auth-feedback-icon" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="auth-feedback auth-feedback--success" role="status">
          <CheckCircle2 size={16} className="auth-feedback-icon" aria-hidden="true" />
          <span>{state.success}</span>
        </div>
      )}

      {!hasSuccess && (
        <form className={`auth-form${isSignup ? ' auth-form--signup' : ''}`} action={formAction}>
          {isSignup && (
            <>
              <label className="auth-field">
                <span>Full name</span>
                <input
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>

              <div className="auth-field-row">
                <label className="auth-field">
                  <span>I work mostly in</span>
                  <select name="role" defaultValue="" required>
                    <option value="" disabled>
                      Select track
                    </option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="auth-field">
                  <span>Experience level</span>
                  <select name="level" defaultValue="" required>
                    <option value="" disabled>
                      Select level
                    </option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="auth-field auth-field--optional">
                <span>
                  Gender <small>OPTIONAL</small>
                </span>
                <select name="gender" defaultValue="Prefer not to say">
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
            </>
          )}

          {(isSignup || isLogin || isForgot) && (
            <label className="auth-field">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
                required
              />
            </label>
          )}

          {(isSignup || isLogin || isReset) && (
            <label className="auth-field">
              <span>
                {isReset ? 'New password' : 'Password'}
                {isLogin && (
                  <Link href="/forgot-password" className="auth-field-link">
                    Forgot password?
                  </Link>
                )}
              </span>
              <div className="auth-password-wrap">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : isReset ? 'new-password' : 'new-password'}
                  minLength={8}
                  placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </label>
          )}

          {(isSignup || isReset) && (
            <label className="auth-field">
              <span>Confirm password</span>
              <input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={8}
                placeholder="Enter password again"
                required
              />
            </label>
          )}

          <button className="auth-submit" type="submit" disabled={pending}>
            <span>
              {pending
                ? 'Please wait...'
                : isSignup
                ? 'Create account'
                : isLogin
                ? 'Sign in'
                : isForgot
                ? 'Send reset link'
                : 'Update password'}
            </span>
            {!pending && <ArrowRight size={17} aria-hidden="true" />}
          </button>
        </form>
      )}

      <div className={`auth-switch${isSignup || isLogin ? ' auth-switch--prominent' : ''}`}>
        {isSignup && (
          <Link className="auth-switch-card" href="/login">
            <span className="auth-switch-label">ALREADY HAVE AN ACCOUNT?</span>
            <strong className="auth-switch-title">
              <span>Sign in to practice</span>
              <ArrowRight size={16} aria-hidden="true" />
            </strong>
          </Link>
        )}
        {isLogin && (
          <Link className="auth-switch-card" href="/signup">
            <span className="auth-switch-label">NEW TO KEEPCODING?</span>
            <strong className="auth-switch-title">
              <span>Create your account</span>
              <ArrowRight size={16} aria-hidden="true" />
            </strong>
          </Link>
        )}
        {(isSignup || isLogin) && (
          <div className="auth-switch-inline" style={{ marginTop: '12px' }}>
            <span>Want to jump straight in?</span>
            <Link href="/studio" className="auth-switch-pill">
              Continue as guest
            </Link>
          </div>
        )}
        {(isSignup || isLogin) && (
          <div className="auth-switch-inline" style={{ marginTop: '10px' }}>
            <Link href="/privacy" className="auth-switch-pill">Privacy policy</Link>
          </div>
        )}
        {isForgot && (
          <div className="auth-switch-inline">
            <span>Remembered your password?</span>
            <Link href="/login" className="auth-switch-pill">
              Back to sign in
            </Link>
          </div>
        )}
        {isReset && (
          <div className="auth-switch-inline">
            <span>Need a fresh link?</span>
            <Link href="/forgot-password" className="auth-switch-pill">
              Request another reset
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
