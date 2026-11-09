'use client';

import { useState, useEffect } from 'react';
import { Check, Copy, Link as LinkIcon, Loader2, Shield, Users, X } from 'lucide-react';

interface InviteModalProps {
  challengeId: string;
  challengeTitle: string;
  visibility: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({
  challengeId,
  challengeTitle,
  visibility,
  isOpen,
  onClose,
}: InviteModalProps) {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);

    fetch(`/api/challenges/${challengeId}/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresInDays }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not create invite link.');
        if (active && data.invite?.token) {
          setToken(data.invite.token);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to generate link');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, challengeId, expiresInDays]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteUrl = token ? `${origin}/join/${token}` : '';

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy link to clipboard.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in-50 duration-150"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#12151e] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#88BDA4]/10 border border-[#88BDA4]/30 flex items-center justify-center text-[#88BDA4] shrink-0">
              <Users size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 id="invite-modal-title" className="text-base font-semibold text-zinc-100">
                Invite Developers
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-xs sm:max-w-sm">
                {challengeTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4]"
            aria-label="Close modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Visibility context badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
          <Shield size={15} className={visibility === 'private' ? 'text-amber-400' : 'text-emerald-400'} aria-hidden="true" />
          <p className="text-zinc-300 leading-relaxed">
            {visibility === 'private' ? (
              <>
                <strong className="text-amber-400 font-medium">Private challenge:</strong> Only developers who accept this invite link will have access. It will automatically appear in their <span className="text-zinc-100 font-mono">Shared with Me</span> list.
              </>
            ) : (
              <>
                <strong className="text-emerald-400 font-medium">Public challenge:</strong> Anyone with this link can jump directly into your challenge and test their skills.
              </>
            )}
          </p>
        </div>

        {/* Link Generator Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider block">
            Shareable Invite Link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={loading ? 'Generating unique invite link...' : inviteUrl}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-200 font-mono outline-none focus:border-[#88BDA4]/60 select-all"
              />
              {loading && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 size={16} className="animate-spin text-[#88BDA4]" aria-hidden="true" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={loading || !token}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                copied
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-[#88BDA4] hover:bg-[#9cd1b8] text-zinc-950 shadow-md shadow-[#88BDA4]/20 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expiration Settings */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium">Link Expiration:</span>
          <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            {[
              { label: 'Never', value: 0 },
              { label: '7 days', value: 7 },
              { label: '30 days', value: 30 },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setExpiresInDays(opt.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  expiresInDays === opt.value
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
            {error}
          </p>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
