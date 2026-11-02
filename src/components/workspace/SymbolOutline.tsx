'use client';

import { useMemo } from 'react';
import { Code2, Hash } from 'lucide-react';

interface SymbolItem {
  name: string;
  kind: 'function' | 'class' | 'type' | 'variable';
  lineNumber: number;
}

interface SymbolOutlineProps {
  content: string;
  filePath: string;
}

export function SymbolOutline({ content, filePath }: SymbolOutlineProps) {
  const fileName = useMemo(() => {
    return filePath ? filePath.split('/').pop() || filePath : '';
  }, [filePath]);

  const symbols = useMemo<SymbolItem[]>(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const items: SymbolItem[] = [];

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();

      // TS/JS function
      const fnMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)/);
      if (fnMatch) {
        items.push({ name: fnMatch[1], kind: 'function', lineNumber: lineNum });
        return;
      }

      // Arrow function
      const arrowMatch = trimmed.match(/^(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(/);
      if (arrowMatch) {
        items.push({ name: arrowMatch[1], kind: 'function', lineNumber: lineNum });
        return;
      }

      // Python def
      const pyDefMatch = trimmed.match(/^def\s+([A-Za-z0-9_]+)\s*\(/);
      if (pyDefMatch) {
        items.push({ name: pyDefMatch[1], kind: 'function', lineNumber: lineNum });
        return;
      }

      // Go func
      const goFuncMatch = trimmed.match(/^func\s+(?:\([A-Za-z0-9_* ]+\)\s+)?([A-Za-z0-9_]+)\s*\(/);
      if (goFuncMatch) {
        items.push({ name: goFuncMatch[1], kind: 'function', lineNumber: lineNum });
        return;
      }

      // Class
      const classMatch = trimmed.match(/^(?:export\s+)?class\s+([A-Za-z0-9_$]+)/);
      if (classMatch) {
        items.push({ name: classMatch[1], kind: 'class', lineNumber: lineNum });
        return;
      }

      // TS Interface / Type
      const typeMatch = trimmed.match(/^(?:export\s+)?(?:interface|type)\s+([A-Za-z0-9_$]+)/);
      if (typeMatch) {
        items.push({ name: typeMatch[1], kind: 'type', lineNumber: lineNum });
        return;
      }
    });

    return items;
  }, [content]);

  return (
    <div className="space-y-1.5 pt-3 border-t border-white/8 rounded-xl" aria-label="Symbol outline">
      <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
        <span>Outline ({symbols.length})</span>
        {fileName && (
          <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[100px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {fileName}
          </span>
        )}
      </div>
      {symbols.length === 0 ? (
        <div className="px-2 py-2 text-xs text-zinc-400 italic font-mono text-[11px]">No symbols detected</div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
          {symbols.map((sym, idx) => (
            <div
              key={`${sym.name}-${idx}`}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Code2 className="w-3 h-3 text-[#88BDA4] shrink-0" aria-hidden="true" />
                <span className="font-mono text-[11px] truncate">{sym.name}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-0.5">
                <Hash className="w-2.5 h-2.5 inline" aria-hidden="true" />
                {sym.lineNumber}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
