import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Code2, FileCode, Lock, ShieldCheck, Terminal } from 'lucide-react';
import './auth.css';

export default function AuthFrame({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: 'signup' | 'login' | 'reset';
}) {
  return (
    <main className="auth-page">
      {/* Background ambient light */}
      <div className="auth-ambient-glow" aria-hidden="true" />

      <header className="auth-header">
        <Link href="/" className="auth-brand" aria-label="KeepCoding home">
          <span className="auth-brand-mark">
            <Image
              src="/images/logo.png"
              alt="KeepCoding logo"
              width={26}
              height={26}
              priority
              className="object-contain drop-shadow-[0_2px_8px_rgba(136,189,164,0.35)]"
            />
          </span>
          <span className="auth-brand-name">KeepCoding</span>
        </Link>
        {mode !== 'reset' && (
          <nav className="auth-route-nav" aria-label="Account access">
            <Link
              href="/login"
              aria-current={mode === 'login' ? 'page' : undefined}
              className={mode === 'login' ? 'is-current' : undefined}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              aria-current={mode === 'signup' ? 'page' : undefined}
              className={mode === 'signup' ? 'is-current' : undefined}
            >
              Create account
            </Link>
          </nav>
        )}
      </header>

      <div className={`auth-layout auth-layout--${mode}`}>
        <aside
          className={`auth-story auth-story--${mode}`}
          aria-label={
            mode === 'signup'
              ? 'Set up your practice profile'
              : mode === 'login'
              ? 'KeepCoding deliberate practice workbench'
              : 'Return to your account'
          }
        >
          {/* Top Pill Badge */}
          <div className="auth-story-top">
            <div className="auth-story-badge">
              {mode === 'signup' ? (
                <>
                  <Terminal size={13} aria-hidden="true" />
                  <span>Tailored Curriculum</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <Code2 size={13} aria-hidden="true" />
                  <span>Developer Workbench</span>
                </>
              ) : (
                <>
                  <Lock size={13} aria-hidden="true" />
                  <span>Account Security</span>
                </>
              )}
            </div>
            <span className="auth-story-tag">
              {mode === 'signup' ? 'SETUP' : mode === 'login' ? 'DELIBERATE PRACTICE' : 'RECOVERY'}
            </span>
          </div>

          {/* Copy and Feature Visuals */}
          {mode === 'signup' ? (
            <>
              <div className="auth-story-copy">
                <h1>
                  Practice what you <em>actually build.</em>
                </h1>
                <p className="auth-story-lede">
                  Hands-on engineering tracks with isolated test suites and realistic multi-file architectures.
                </p>
              </div>

              <div className="auth-feature-showcase" aria-label="Curriculum tracks">
                <div className="auth-showcase-card">
                  <div className="auth-showcase-label">ENGINEERING TRACKS</div>
                  <div className="auth-track-pills">
                    <span className="auth-track-pill">Web</span>
                    <span className="auth-track-pill">Mobile</span>
                    <span className="auth-track-pill">Backend</span>
                    <span className="auth-track-pill">Data</span>
                  </div>
                </div>

                <div className="auth-showcase-highlight">
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>Automated test verification on every submission</span>
                </div>
              </div>
            </>
          ) : mode === 'login' ? (
            <>
              <div className="auth-story-copy">
                <h1>
                  Build real <em>muscle memory.</em>
                </h1>
                <p className="auth-story-lede">
                  Inspect specifications, solve edge cases by hand, and receive instant automated grading.
                </p>
              </div>

              <div className="auth-feature-showcase" aria-label="KeepCoding practice pillars">
                <div className="auth-feature-row">
                  <span className="auth-feature-icon">
                    <FileCode size={16} aria-hidden="true" />
                  </span>
                  <div className="auth-feature-text">
                    <strong>Multi-File Codebases</strong>
                    <span>Realistic architectures with separated editable and read-only files.</span>
                  </div>
                </div>

                <div className="auth-feature-row">
                  <span className="auth-feature-icon">
                    <CheckCircle2 size={16} aria-hidden="true" />
                  </span>
                  <div className="auth-feature-text">
                    <strong>Instant Automated Feedback</strong>
                    <span>Evaluation verifies logical contracts and edge cases immediately.</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="auth-story-copy">
                <h1>
                  Get back into <em>your flow.</em>
                </h1>
                <p className="auth-story-lede">
                  Reset your password and continue your deliberate practice streak.
                </p>
              </div>

              <div className="auth-feature-showcase" aria-label="Account security details">
                <div className="auth-feature-row">
                  <span className="auth-feature-icon">
                    <Lock size={16} aria-hidden="true" />
                  </span>
                  <div className="auth-feature-text">
                    <strong>Encrypted Authentication</strong>
                    <span>Secure account sessions backed by Supabase Auth.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer Metadata */}
          <div className="auth-story-foot">
            <span>KeepCoding Platform</span>
            <span>Deliberate Practice v2</span>
          </div>
        </aside>

        <section className={`auth-panel auth-panel--${mode}`}>
          <div className="auth-panel-inner">{children}</div>
        </section>
      </div>
    </main>
  );
}
