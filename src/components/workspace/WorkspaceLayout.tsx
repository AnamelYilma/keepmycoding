'use client';

import { useState } from 'react';
import { FileCode, BookOpen, Layers } from 'lucide-react';
import { Challenge, ChallengeFile } from '@/lib/types/challenge';
import { WorkspaceHeader } from './WorkspaceHeader';
import { FileList } from './FileList';
import { SymbolOutline } from './SymbolOutline';
import { CodeEditor } from './CodeEditor';
import { TaskGuidePane } from './TaskGuidePane';

interface WorkspaceLayoutProps {
  challenge: Challenge;
  files: ChallengeFile[];
  activeFile: ChallengeFile;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onUpdateFileContent: (path: string, newContent: string) => void;
  isFileDirty: (path: string) => boolean;
  isDirty: boolean;
  onResetFile: (path: string) => void;
  onResetAll: () => void;
  isJudging: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function WorkspaceLayout({
  challenge,
  files,
  activeFile,
  activeFilePath,
  onSelectFile,
  onUpdateFileContent,
  isFileDirty,
  isDirty,
  onResetFile,
  onResetAll,
  isJudging,
  onSubmit,
  onBack,
}: WorkspaceLayoutProps) {
  const [mobileTab, setMobileTab] = useState<'editor' | 'task' | 'files'>('editor');
  const [targetLine, setTargetLine] = useState<number | null>(null);

  const handleSelectSymbol = (lineNumber: number) => {
    // Switch to editor tab on mobile if currently in files tab
    setMobileTab('editor');
    // Ensure state updates even if clicking the exact same line twice
    setTargetLine(null);
    requestAnimationFrame(() => {
      setTargetLine(lineNumber);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#090A0F] text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <WorkspaceHeader
        metadata={challenge.metadata}
        isDirty={isDirty}
        isJudging={isJudging}
        onBack={onBack}
        onResetAll={onResetAll}
        onSubmit={onSubmit}
      />

      {/* Mobile Tab Switcher (< md) */}
      <div className="md:hidden flex items-center justify-center p-2 bg-[#090A0F] border-b border-white/8 shrink-0">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#11131A] border border-white/10" role="tablist" aria-label="Mobile workspace view">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'editor'}
            onClick={() => setMobileTab('editor')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              mobileTab === 'editor'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <FileCode size={13} aria-hidden="true" />
            <span>Code</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'task'}
            onClick={() => setMobileTab('task')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              mobileTab === 'task'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <BookOpen size={13} aria-hidden="true" />
            <span>Task &amp; Tests</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'files'}
            onClick={() => setMobileTab('files')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
              mobileTab === 'files'
                ? 'bg-[#88BDA4] text-[#090A0F] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Layers size={13} aria-hidden="true" />
            <span>Files ({files.length})</span>
          </button>
        </div>
      </div>

      {/* 3-Column Body Landmark */}
      <main aria-label="Hands-on coding workspace" className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 p-2 sm:p-3 overflow-hidden h-[calc(100vh-3.5rem)] min-h-0">
        {/* Left Column: Explorer & Outline (2.5 of 12 columns) */}
        <aside
          aria-label="Files and symbols"
          className={`${
            mobileTab === 'files' ? 'flex flex-1' : 'hidden'
          } md:flex md:col-span-3 lg:col-span-2 flex-col bg-[#12151e] border border-white/12 rounded-xl p-3 overflow-y-auto space-y-4 shadow-lg min-h-0`}
        >
          <FileList
            files={files}
            activeFilePath={activeFilePath}
            onSelectFile={(path) => {
              onSelectFile(path);
              setMobileTab('editor');
            }}
            isFileDirty={isFileDirty}
            onResetFile={onResetFile}
          />
          <SymbolOutline
            content={activeFile.content}
            filePath={activeFile.path}
            onSelectSymbol={handleSelectSymbol}
          />
        </aside>

        {/* Center Column: Editor (6.5 of 12 columns) */}
        <div
          className={`${
            mobileTab === 'editor' ? 'flex flex-1' : 'hidden'
          } md:flex md:col-span-6 lg:col-span-7 flex-col h-full min-h-0`}
        >
          <CodeEditor
            file={activeFile}
            onChange={(val) => onUpdateFileContent(activeFile.path, val)}
            isDirty={isFileDirty(activeFile.path)}
            targetLine={targetLine}
          />
        </div>

        {/* Right Column: Task, Tests, Cheat Sheet (3 of 12 columns) */}
        <aside
          aria-label="Task specifications and acceptance tests"
          className={`${
            mobileTab === 'task' ? 'flex flex-1' : 'hidden'
          } md:flex md:col-span-3 lg:col-span-3 flex-col h-full min-h-0`}
        >
          <TaskGuidePane
            task={challenge.task}
            tests={challenge.tests}
            language={challenge.metadata.editableLanguage || 'code'}
          />
        </aside>
      </main>
    </div>
  );
}
