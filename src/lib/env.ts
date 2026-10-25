// Safe server-side environment variable reader
// Follows consider.md: Zero Secret Leakage. Never exposes secrets to client or logs.

export interface ServerEnv {
  aiApiKey: string;
  databaseUrl?: string;
}

export function getServerEnv(): ServerEnv {
  // Ensure this function is only executed on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Security Violation: getServerEnv must never be invoked on the client side.');
  }

  const aiApiKey = process.env.AI_API_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  return {
    aiApiKey: aiApiKey || '',
    databaseUrl,
  };
}

export function isAiJudgeConfigured(): boolean {
  if (typeof window !== 'undefined') return false;
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
}
