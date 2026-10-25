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
    <div className="space-y-1">
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Workspace Files ({files.length})
      </div>
      <div className="space-y-0.5">
        {files.map((file) => {
          const isActive = file.path === activeFilePath;
          const isDirty = isFileDirty(file.path);
          const isTextAnswer = file.isAnswerFile;

          return (
            <div
              key={file.path}
              className={`group flex items-center justify-between px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
              onClick={() => onSelectFile(file.path)}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isTextAnswer ? (
                  <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
                <span className="truncate font-mono text-[11px]">{file.path}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isDirty && (
                  <span
                    title="Modified"
                    className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  />
                )}
                {!file.isEditable && (
                  <span title="Read-only file">
                    <Lock className="w-3 h-3 text-zinc-500" />
                  </span>
                )}
                {isDirty && (
                  <button
                    type="button"
                    title="Reset this file"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetFile(file.path);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-zinc-200 text-zinc-500 transition-opacity"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
