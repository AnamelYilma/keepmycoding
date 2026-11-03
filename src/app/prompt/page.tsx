import type { Metadata } from 'next';
import { PromptWizardPage } from './PromptWizardPage';

export const metadata: Metadata = {
  title: 'Challenge Prompt Generator | KeepCoding',
  description: 'Configure and copy structured prompts to your external AI, then paste your challenge into KeepCoding.',
};

export default function PromptRoute() {
  return <PromptWizardPage />;
}
