// KeepCoding - Workspace Files Hook
// Manages challenge file state, tracking modifications and providing reset operations

import { useState, useCallback, useMemo } from 'react';
import { ChallengeFile } from '@/lib/types/challenge';

export interface UseWorkspaceFilesReturn {
  files: ChallengeFile[];
  activeFilePath: string;
  activeFile: ChallengeFile | undefined;
  setActiveFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  isDirty: boolean;
  isFileDirty: (path: string) => boolean;
  resetFile: (path: string) => void;
  resetAllFiles: () => void;
}

export function useWorkspaceFiles(initialFiles: ChallengeFile[]): UseWorkspaceFilesReturn {
  const [prevInitialFiles, setPrevInitialFiles] = useState(initialFiles);
  const [files, setFiles] = useState<ChallengeFile[]>(() =>
    (initialFiles || []).map((f) => ({
      ...f,
      startContent: f.startContent ?? f.content,
    }))
  );

  // Default active file is the first editable file, or first file
  const [activeFilePath, setActiveFilePath] = useState<string>(() => {
    const firstEditable = (initialFiles || []).find((f) => f.isEditable);
    return firstEditable?.path || initialFiles?.[0]?.path || '';
  });

  // Synchronize internal state whenever initialFiles prop identity changes during render
  if (initialFiles !== prevInitialFiles) {
    setPrevInitialFiles(initialFiles);
    setFiles(
      (initialFiles || []).map((f) => ({
        ...f,
        startContent: f.startContent ?? f.content,
      }))
    );
    const firstEditable = (initialFiles || []).find((f) => f.isEditable);
    setActiveFilePath(firstEditable?.path || initialFiles?.[0]?.path || '');
  }

  const activeFile = useMemo(() => {
    if (!files || files.length === 0) return undefined;
    return files.find((f) => f.path === activeFilePath) || files[0];
  }, [files, activeFilePath]);

  const updateFileContent = useCallback((path: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.path === path) {
          return { ...f, content: newContent };
        }
        return f;
      })
    );
  }, []);

  const isFileDirty = useCallback(
    (path: string) => {
      const target = files.find((f) => f.path === path);
      if (!target) return false;
      return target.content !== target.startContent;
    },
    [files]
  );

  const isDirty = useMemo(() => {
    return files.some((f) => f.content !== f.startContent);
  }, [files]);

  const resetFile = useCallback((path: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.path === path) {
          return { ...f, content: f.startContent };
        }
        return f;
      })
    );
  }, []);

  const resetAllFiles = useCallback(() => {
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        content: f.startContent,
      }))
    );
  }, []);

  return {
    files,
    activeFilePath,
    activeFile,
    setActiveFilePath,
    updateFileContent,
    isDirty,
    isFileDirty,
    resetFile,
    resetAllFiles,
  };
}
