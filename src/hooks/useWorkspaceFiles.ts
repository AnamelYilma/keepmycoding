// KeepCoding - Workspace Files Hook
// Manages challenge file state, tracking modifications and providing reset operations

import { useState, useCallback, useMemo, useEffect } from 'react';
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

  // Synchronize internal state whenever initialFiles changes (e.g. when opening a challenge)
  useEffect(() => {
    if (!initialFiles || initialFiles.length === 0) {
      setFiles((prev) => (prev.length === 0 ? prev : []));
      setActiveFilePath((prev) => (prev === '' ? prev : ''));
      return;
    }

    setFiles((prev) => {
      const isSame =
        prev.length === initialFiles.length &&
        prev.every(
          (f, i) =>
            f.path === initialFiles[i]?.path &&
            f.startContent === (initialFiles[i]?.startContent ?? initialFiles[i]?.content)
        );
      if (isSame) return prev;

      return initialFiles.map((f) => ({
        ...f,
        startContent: f.startContent ?? f.content,
      }));
    });

    const firstEditable = initialFiles.find((f) => f.isEditable);
    const targetPath = firstEditable?.path || initialFiles[0]?.path || '';
    setActiveFilePath((prev) => (prev === targetPath ? prev : targetPath));
  }, [initialFiles]);

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
