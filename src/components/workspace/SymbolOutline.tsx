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
    <div className="space-y-1 pt-3 border-t border-zinc-800/80">
      <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Outline ({symbols.length})
      </div>
      {symbols.length === 0 ? (
        <div className="px-3 py-2 text-xs text-zinc-600 italic">No symbols detected</div>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {symbols.map((sym, idx) => (
            <div
              key={`${sym.name}-${idx}`}
              className="flex items-center justify-between px-3 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Code2 className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="font-mono text-[11px] truncate">{sym.name}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 flex items-center">
                <Hash className="w-2.5 h-2.5 inline" />
                {sym.lineNumber}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
