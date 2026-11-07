import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | KeepCoding',
  description: 'How KeepCoding handles challenge activity and submitted code.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="border-b border-zinc-800 pb-6">
          <Link href="/signup" className="text-sm text-zinc-400 hover:text-zinc-100">Back to account</Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Privacy policy</h1>
          <p className="mt-2 text-sm text-zinc-500">Updated November 7, 2026</p>
        </header>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Information KeepCoding stores</h2>
          <p className="text-sm leading-6 text-zinc-300">When you create an account, KeepCoding uses your email and the profile details you provide, such as your name, developer role, and experience level. Challenge records and attempt activity are stored in the connected Supabase project. Practice history for challenges outside the library is stored in your browser.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Challenge activity</h2>
          <p className="text-sm leading-6 text-zinc-300">When you start a challenge, KeepCoding records your account and the start time. The creator can see your account name and whether you tried or completed the challenge. KeepCoding does not share your submitted code or solution with the challenge creator.</p>
          <p className="text-sm leading-6 text-zinc-300">Private challenges are visible only to their creator. Public challenges can be found and practiced by other KeepCoding users. A public challenge includes its task and starter files. Its reference solution and source links are shown to a solver after a passing submission.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Code and evaluation</h2>
          <p className="text-sm leading-6 text-zinc-300">Your code is sent to KeepCoding’s server-side judge when you submit it for evaluation. Depending on the server configuration, the judge may send the submission to an external AI evaluation provider. Challenge authors cannot access your workspace code through challenge activity records.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Questions</h2>
          <p className="text-sm leading-6 text-zinc-300">For questions about account or challenge data, contact the KeepCoding project maintainer.</p>
        </section>
      </article>
    </main>
  );
}
