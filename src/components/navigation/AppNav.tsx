'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LogOut, Plus, User } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface AppNavProps {
  user?: { id: string; email?: string; name: string } | null;
}

function AppNavInner({ user: initialUser }: AppNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(initialUser ?? null);
  const currentTab = searchParams.get('tab');

  useEffect(() => {
    if (initialUser !== undefined) return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'KeepCoding developer',
        });
      } else {
        setCurrentUser(null);
      }
    });
  }, [initialUser]);

  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  }

  const isHomeActive = pathname === '/challenges' && currentTab !== 'mine';
  const isMineActive = pathname === '/challenges' && currentTab === 'mine';
  const isCreateActive = pathname === '/challenges/create';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/challenges"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-md p-1"
            aria-label="KeepCoding home"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-lg">
              <Image
                src="/logo2nd.png"
                alt="KeepCoding logo"
                width={28}
                height={28}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">KeepCoding</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            <Link
              href="/challenges"
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isHomeActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              Home
            </Link>

            <Link
              href="/challenges?tab=mine"
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isMineActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              My Challenges
            </Link>

            <Link
              href="/challenges/create"
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isCreateActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              Create
            </Link>
          </nav>
        </div>

        {/* Right side: User profile & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/challenges/create"
            className="hidden items-center gap-1.5 rounded-lg bg-[#88BDA4] px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-[#9cd1b8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 sm:inline-flex"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Create challenge</span>
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
                <User size={13} className="text-zinc-500" aria-hidden="true" />
                <span className="max-w-[120px] truncate font-medium text-zinc-200">{currentUser.name}</span>
              </div>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                title="Sign out"
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                aria-label="Sign out"
              >
                <LogOut size={14} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex border-t border-zinc-800/80 px-4 py-2 sm:hidden justify-around text-xs">
        <Link
          href="/challenges"
          className={`px-2 py-1 ${isHomeActive ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}`}
        >
          Home
        </Link>
        <Link
          href="/challenges?tab=mine"
          className={`px-2 py-1 ${isMineActive ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}`}
        >
          My Challenges
        </Link>
        <Link
          href="/challenges/create"
          className={`px-2 py-1 ${isCreateActive ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}`}
        >
          Create
        </Link>
      </div>
    </header>
  );
}

export default function AppNav(props: AppNavProps) {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-30 h-14 w-full border-b border-zinc-800 bg-zinc-950/90" />
    }>
      <AppNavInner {...props} />
    </Suspense>
  );
}
