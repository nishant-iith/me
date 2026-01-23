import React, { useState, memo } from 'react';
import { Code2, Copy, Check, ChevronDown, ChevronUp, Terminal, Braces, FileCode } from 'lucide-react';

// Sample code snippets - can be expanded
const snippets = [
    {
        id: 1,
        category: 'JavaScript',
        title: 'Debounce Function',
        description: 'Limits function execution rate for performance optimization.',
        language: 'javascript',
        code: `function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);`,
    },
    {
        id: 2,
        category: 'JavaScript',
        title: 'Deep Clone Object',
        description: 'Creates a deep copy of nested objects.',
        language: 'javascript',
        code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}`,
    },
    {
        id: 3,
        category: 'React',
        title: 'useLocalStorage Hook',
        description: 'Persist state to localStorage with auto-sync.',
        language: 'javascript',
        code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
    },
    {
        id: 4,
        category: 'Python',
        title: 'Flatten Nested List',
        description: 'Recursively flattens arbitrarily nested lists.',
        language: 'python',
        code: `def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

# Usage
nested = [1, [2, [3, 4], 5], 6]
print(flatten(nested))  # [1, 2, 3, 4, 5, 6]`,
    },
    {
        id: 5,
        category: 'Bash',
        title: 'Git Branch Cleanup',
        description: 'Delete merged local branches except main/master.',
        language: 'bash',
        code: `#!/bin/bash
# Delete all local branches that have been merged
git branch --merged | grep -v "main\\|master\\|\\*" | xargs -n 1 git branch -d

# Force delete unmerged branches (careful!)
# git branch --no-merged | xargs -n 1 git branch -D`,
    },
    {
        id: 6,
        category: 'CSS',
        title: 'Glassmorphism Card',
        description: 'Modern frosted glass effect for UI elements.',
        language: 'css',
        code: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}`,
    },
];

const categoryIcons = {
    JavaScript: <Braces size={14} />,
    React: <Code2 size={14} />,
    Python: <FileCode size={14} />,
    Bash: <Terminal size={14} />,
    CSS: <Code2 size={14} />,
};

const Snippets = () => {
    const [expandedId, setExpandedId] = useState(null);
    const categories = [...new Set(snippets.map(s => s.category))];

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-4">
                <h2 className="font-mono text-lg text-zinc-200">Code Snippets</h2>
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                    // {snippets.length} snippets
                </span>
            </div>

            {/* Snippets by Category */}
            {categories.map(category => (
                <div key={category} className="flex flex-col gap-3">
                    <h3 className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-widest">
                        {categoryIcons[category] || <Code2 size={14} />}
                        {category}
                    </h3>

                    <div className="flex flex-col gap-2">
                        {snippets
                            .filter(s => s.category === category)
                            .map(snippet => (
                                <SnippetCard
                                    key={snippet.id}
                                    snippet={snippet}
                                    isExpanded={expandedId === snippet.id}
                                    onToggle={() => setExpandedId(
                                        expandedId === snippet.id ? null : snippet.id
                                    )}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const SnippetCard = memo(({ snippet, isExpanded, onToggle }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-dashed border-zinc-800 rounded-sm bg-black/20 overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/30 transition-colors"
            >
                <div className="flex flex-col items-start gap-1">
                    <h4 className="font-mono text-sm text-zinc-200">{snippet.title}</h4>
                    <p className="font-mono text-[10px] text-zinc-500">{snippet.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded">
                        {snippet.language}
                    </span>
                    {isExpanded ? (
                        <ChevronUp size={14} className="text-zinc-500" />
                    ) : (
                        <ChevronDown size={14} className="text-zinc-500" />
                    )}
                </div>
            </button>

            {/* Code Block */}
            {isExpanded && (
                <div className="relative border-t border-dashed border-zinc-800">
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-colors z-10"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    </button>
                    <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-400 bg-zinc-950/50">
                        <code>{snippet.code}</code>
                    </pre>
                </div>
            )}
        </div>
    );
});

SnippetCard.displayName = 'SnippetCard';

export default Snippets;
