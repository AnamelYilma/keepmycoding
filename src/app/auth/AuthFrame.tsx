import Link from 'next/link';
import { ArrowDownRight, Code2 } from 'lucide-react';
import './auth.css';

export default function AuthFrame({ children, mode }: { children: React.ReactNode; mode: 'signup' | 'login' | 'reset' }) {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link href="/" className="auth-brand" aria-label="KeepCoding home">
          <span className="auth-brand-mark"><Code2 size={18} aria-hidden="true" /></span>
          <span>KeepCoding</span>
        </Link>
        {mode !== 'reset' && <nav className="auth-route-nav" aria-label="Account access">
          <Link href="/login" aria-current={mode === 'login' ? 'page' : undefined} className={mode === 'login' ? 'is-current' : undefined}>Sign in</Link>
          <Link href="/signup" aria-current={mode === 'signup' ? 'page' : undefined} className={mode === 'signup' ? 'is-current' : undefined}>Create account</Link>
        </nav>}
      </header>

      <div className={`auth-layout auth-layout--${mode}`}>
        <aside className={`auth-story auth-story--${mode}`} aria-label={mode === 'signup' ? 'Set up your practice profile' : mode === 'login' ? 'A sample KeepCoding challenge' : 'Return to your account'}>
          <div className="auth-story-top"><span>{mode === 'signup' ? 'CREATE ACCOUNT / 001' : mode === 'login' ? 'SAMPLE CHALLENGE / 001' : 'ACCOUNT ACCESS / 002'}</span><span>{mode === 'signup' ? 'YOUR PROFILE' : mode === 'login' ? 'TOKEN EXPIRY' : 'KEEP YOUR PLACE'}</span></div>

          {mode === 'signup' ? <>
            <div className="auth-story-copy">
              <p className="auth-eyebrow"><i /> A PROFILE, NOT A TEST</p>
              <h1>Tell us what you <em>build.</em></h1>
              <p className="auth-story-lede">Choose a main track and the level that feels right today. You can adjust both as your practice changes.</p>
            </div>
            <div className="auth-profile-study" aria-label="Developer tracks and experience levels">
              <div className="auth-profile-row"><span>YOUR TRACK</span><strong>WEB · MOBILE · BACKEND · BLOCKCHAIN · DATA & AI</strong><ArrowDownRight size={16} aria-hidden="true" /></div>
              <div className="auth-profile-levels"><span>EXPERIENCE</span><div><b>BEGINNER</b><b>JUNIOR</b><b>INTERMEDIATE</b><b>SENIOR</b></div></div>
            </div>
          </> : mode === 'login' ? <>
            <div className="auth-story-copy">
              <p className="auth-eyebrow"><i /> BACK TO THE WORK</p>
              <h1>Pick up<br />the <em>thread.</em></h1>
              <p className="auth-story-lede">Read the task. Make the change. Find out what the tests say.</p>
            </div>
            <div className="auth-case-study" aria-label="JWT expiry example: 1000 is before now at 1500, so the token is expired">
              <div className="auth-case-rule"><span>exp</span><i /><strong>1,000</strong><small>PAST</small></div>
              <div className="auth-case-now"><span>now</span><strong>1,500</strong><small>REFERENCE</small></div>
              <div className="auth-case-answer"><code>exp &lt; now</code><span>expired <b>TRUE</b></span></div>
            </div>
          </> : <>
            <div className="auth-story-copy">
              <p className="auth-eyebrow"><i /> BACK TO YOUR ACCOUNT</p>
              <h1>Get back<br />to <em>practice.</em></h1>
              <p className="auth-story-lede">Use your email to recover access, then choose a new password.</p>
            </div>
            <div className="auth-recovery-mark" aria-hidden="true"><span>ACCESS</span><i /><span>RESTORED</span></div>
          </>}

          <div className="auth-story-foot"><span>{mode === 'signup' ? 'KEEPCODING / PROFILE' : mode === 'login' ? 'KEEPCODING' : 'KEEPCODING / ACCESS'}</span><span>{mode === 'signup' ? 'SETUP' : mode === 'login' ? 'SAMPLE 001' : 'RECOVERY'}</span></div>
        </aside>

        <section className={`auth-panel auth-panel--${mode}`}>
          <div className="auth-panel-inner">{children}</div>
        </section>
      </div>
    </main>
  );
}
