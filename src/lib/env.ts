// Safe server-side environment variable reader
// Follows consider.md: Zero Secret Leakage. Never exposes secrets to client or logs.

export interface ServerEnv {
  aiApiKey: string;
  aiModel: string;
  aiApiBaseUrl: string;
  databaseUrl?: string;
}

export function getServerEnv(): ServerEnv {
  // Ensure this function is only executed on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Security Violation: getServerEnv must never be invoked on the client side.');
  }

  const aiApiKey = process.env.AI_API_KEY;
  const aiModel = process.env.AI_MODEL || 'gemini-2.5-flash';
  const aiApiBaseUrl = process.env.AI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
  const databaseUrl = process.env.DATABASE_URL;

  return {
    aiApiKey: aiApiKey || '',
    aiModel,
    aiApiBaseUrl,
    databaseUrl,
  };
}

export function isAiJudgeConfigured(): boolean {
  if (typeof window !== 'undefined') return false;
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
}
