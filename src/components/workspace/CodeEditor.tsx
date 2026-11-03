'use client';

import { useMemo, useRef, useEffect } from 'react';
import CodeMirror, { ReactCodeMirrorRef, EditorView } from '@uiw/react-codemirror';
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
  targetLine?: number | null;
}

export function CodeEditor({ file, onChange, isDirty, targetLine }: CodeEditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // Jump and scroll to line when targetLine changes
  useEffect(() => {
    if (!targetLine || !editorRef.current?.view) return;

    const view = editorRef.current.view;
    const doc = view.state.doc;
    const clampedLine = Math.min(Math.max(1, targetLine), doc.lines);
    const line = doc.line(clampedLine);

    view.dispatch({
      selection: { anchor: line.from },
      scrollIntoView: true,
      effects: EditorView.scrollIntoView(line.from, { y: 'center' }),
    });
    view.focus();
  }, [targetLine]);
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
    <div className="flex flex-col h-full bg-[#11131A]/85 backdrop-blur-md border border-white/8 rounded-xl overflow-hidden shadow-lg">
      {/* File Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090A0F]/90 border-b border-white/8 text-xs">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-[#88BDA4]" aria-hidden="true" />
          <span className="font-mono font-medium text-zinc-100">{file.path}</span>
          {isDirty && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-medium" aria-label="Modified">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!file.isEditable ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
              <Lock className="w-3 h-3 text-zinc-400" aria-hidden="true" />
              Read-only
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#88BDA4] font-mono px-2.5 py-0.5 rounded-full bg-[#88BDA4]/10 border border-[#88BDA4]/25">
              <Check className="w-3 h-3 text-[#88BDA4]" aria-hidden="true" />
              Editable
            </span>
          )}
        </div>
      </div>

      {/* Readonly Alert Banner if locked */}
      {!file.isEditable && (
        <div className="px-4 py-2 bg-[#090A0F] border-b border-white/8 flex items-center gap-2 text-xs text-zinc-400" role="status">
          <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
          <span>This file is read-only reference context and cannot be edited.</span>
        </div>
      )}

      {/* CodeMirror Workspace */}
      <div className="flex-1 overflow-auto font-mono text-[13px] bg-[#090A0F]">
        <CodeMirror
          ref={editorRef}
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
