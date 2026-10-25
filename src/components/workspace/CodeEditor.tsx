'use client';

import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { go } from '@codemirror/lang-go';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { Lock, FileCode, Check } from 'lucide-react';
import { ChallengeFile } from '@/lib/types/challenge';

interface CodeEditorProps {
  file: ChallengeFile;
  onChange: (newContent: string) => void;
  isDirty: boolean;
}

export function CodeEditor({ file, onChange, isDirty }: CodeEditorProps) {
  const languageExtension = useMemo(() => {
    const ext = file.path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
        return javascript({ typescript: true });
      case 'tsx':
        return javascript({ typescript: true, jsx: true });
      case 'js':
      case 'mjs':
      case 'cjs':
        return javascript();
      case 'jsx':
        return javascript({ jsx: true });
      case 'py':
        return python();
      case 'go':
        return go();
      case 'html':
      case 'htm':
        return html();
      case 'css':
      case 'scss':
        return css();
      default:
        return undefined;
    }
  }, [file.path]);

  const extensions = useMemo(() => {
    return languageExtension ? [languageExtension] : [];
  }, [languageExtension]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {/* File Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono font-medium text-zinc-200">{file.path}</span>
          {isDirty && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Edited
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!file.isEditable ? (
            <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
              <Lock className="w-3 h-3 text-zinc-500" />
              Read-only
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <Check className="w-3 h-3 text-emerald-400" />
              Editable
            </span>
          )}
        </div>
      </div>

      {/* Readonly Alert Banner if locked */}
      {!file.isEditable && (
        <div className="px-4 py-1.5 bg-zinc-900 border-b border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
          <Lock className="w-3 h-3 text-zinc-500" />
          <span>This file is read-only reference context and cannot be edited.</span>
        </div>
      )}

      {/* CodeMirror Workspace */}
      <div className="flex-1 overflow-auto font-mono text-[13px]">
        <CodeMirror
          value={file.content}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          readOnly={!file.isEditable}
          editable={file.isEditable}
          onChange={(val) => {
            if (file.isEditable) {
              onChange(val);
            }
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}
