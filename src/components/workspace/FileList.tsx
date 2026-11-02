'use client';

import { FileCode, Lock, FileText, RotateCcw } from 'lucide-react';
import { ChallengeFile } from '@/lib/types/challenge';

interface FileListProps {
  files: ChallengeFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  isFileDirty: (path: string) => boolean;
  onResetFile: (path: string) => void;
}

export function FileList({
  files,
  activeFilePath,
  onSelectFile,
  isFileDirty,
  onResetFile,
}: FileListProps) {
  return (
    <nav className="space-y-1.5" aria-label="Challenge files">
      <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
        Workspace Files ({files.length})
      </div>
      <div className="space-y-1">
        {files.map((file) => {
          const isActive = file.path === activeFilePath;
          const isDirty = isFileDirty(file.path);
          const isTextAnswer = file.isAnswerFile;

          return (
            <div
              key={file.path}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`Select file ${file.path}${!file.isEditable ? ' (read-only)' : ''}${isDirty ? ' (modified)' : ''}`}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88BDA4] ${
                isActive
                  ? 'bg-[#171a24] text-zinc-100 font-medium border border-[#88BDA4]/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
              }`}
              onClick={() => onSelectFile(file.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFile(file.path);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isTextAnswer ? (
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#88BDA4]' : 'text-zinc-400'}`} aria-hidden="true" />
                ) : (
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#88BDA4]' : 'text-zinc-400'}`} aria-hidden="true" />
                )}
                <span className="truncate font-mono text-[11px]">{file.path}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isDirty && (
                  <span
                    title="Modified"
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20"
                    aria-label="Modified"
                  />
                )}
                {!file.isEditable && (
                  <span title="Read-only file" aria-label="Read-only file">
                    <Lock className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                  </span>
                )}
                {isDirty && (
                  <button
                    type="button"
                    title="Reset this file"
                    aria-label={`Reset ${file.path}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-zinc-200 text-zinc-400 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#88BDA4] rounded"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
