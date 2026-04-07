import type { ReactNode } from "react";

/**
 * Renders a plain string that may contain lightweight markdown:
 *   - [text](url)  → <a>
 *   - **text**      → <strong>
 *   - `code`        → <code>
 */
export default function RichText({ text, className }: { text: string; className?: string }) {
  const tokens = tokenize(text);
  return <span className={className}>{tokens}</span>;
}

const MD_RE = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|`([^`]+)`)/g;

function tokenize(src: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of src.matchAll(MD_RE)) {
    const idx = m.index!;
    if (idx > last) parts.push(src.slice(last, idx));

    if (m[2] && m[3]) {
      parts.push(
        <a
          key={key++}
          href={m[3]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {m[2]}
        </a>,
      );
    } else if (m[4]) {
      parts.push(<strong key={key++}>{m[4]}</strong>);
    } else if (m[5]) {
      parts.push(
        <code key={key++} className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-800">
          {m[5]}
        </code>,
      );
    }
    last = idx + m[0].length;
  }

  if (last < src.length) parts.push(src.slice(last));
  return parts;
}
