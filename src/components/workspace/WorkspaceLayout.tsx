'use client';

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
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <WorkspaceHeader
        metadata={challenge.metadata}
        isDirty={isDirty}
        isJudging={isJudging}
        onBack={onBack}
        onResetAll={onResetAll}
        onSubmit={onSubmit}
      />

      {/* 3-Column Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* Left Column: Explorer & Outline (2.5 of 12 columns) */}
        <div className="hidden md:flex md:col-span-3 lg:col-span-2 flex-col bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 overflow-y-auto space-y-4">
          <FileList
            files={files}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
            isFileDirty={isFileDirty}
            onResetFile={onResetFile}
          />
          <SymbolOutline
            content={activeFile.content}
            filePath={activeFile.path}
          />
        </div>

        {/* Center Column: Editor (6.5 of 12 columns) */}
        <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col h-full min-h-0">
          <CodeEditor
            file={activeFile}
            onChange={(val) => onUpdateFileContent(activeFile.path, val)}
            isDirty={isFileDirty(activeFile.path)}
          />
        </div>

        {/* Right Column: Task, Tests, Cheat Sheet (3 of 12 columns) */}
        <div className="hidden md:flex md:col-span-3 lg:col-span-3 flex-col h-full min-h-0">
          <TaskGuidePane
            task={challenge.task}
            tests={challenge.tests}
            language={challenge.metadata.editableLanguage || 'code'}
          />
        </div>
      </div>
    </div>
  );
}
