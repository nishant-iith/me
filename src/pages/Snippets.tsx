import { useState, useEffect, memo } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

// Singleton highlighter — created once, reused for all snippets
let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = (): Promise<Highlighter> => {
    if (highlighterInstance) return Promise.resolve(highlighterInstance);
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ['github-dark'],
            langs: ['cpp', 'typescript', 'python', 'bash', 'javascript'],
        }).then((h) => {
            highlighterInstance = h;
            return h;
        });
    }
    return highlighterPromise;
};
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PatternDivider } from '~components/SharedLayout';

interface Snippet {
    id: number;
    category: string;
    title: string;
    description: string;
    language: string;
    code: string;
}

// Sample code snippets - can be expanded
const snippets: Snippet[] = [
    {
        id: 1,
        category: 'C++',
        title: 'Codeforces Template',
        description: 'A robust starting point for competitive programming with Helper class and fast I/O.',
        language: 'cpp',
        code: `#include<bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
typedef vector<int> vi;
typedef map<int, int> mii;

#define pb push_back
#define all(x) (x).begin(),(x).end()
#define loop(i, a, b) for(int i=a; i<b; i++)
#define rloop(i, a, b) for(int i=a-1; i>=b; i--)

class Helper {
protected:
    vi arrayInput(){
        int n;
        cin>>n;
        vi arr(n);
        loop(i, 0, n) cin>>arr[i];
        return arr;
    }
    vi arrayInput(int n){
        vi arr(n);
        loop(i, 0, n) cin>>arr[i];
        return arr;
    }
    string stringInput(){
        string s;
        cin>>s;
        return s;
    }
    void printArray(const vi &arr){
        for(int i=0; i<arr.size(); i++){
            cout<<arr[i]<<" ";
        }
        cout<<endl;
    }
};

class Solution : public Helper {
public:
    void solve(){
        // Your code here
    }
};

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;
    if (cin >> t) {
        while(t--){
            Solution sol;
            sol.solve();
        }
    }
    return 0;
}`,
    },
];



const Snippets = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const categories = [...new Set(snippets.map((s: Snippet) => s.category))];

    return (
        <div className="flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-4">
                <h2 className="font-mono text-lg text-zinc-200">Code Snippets</h2>
                <div className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {snippets.length} active
                </div>
            </div>

            <PatternDivider />

            {/* List */}
            <div className="flex flex-col gap-12 mb-12">
                {categories.map((category: string) => (
                    <div key={category} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="size-1.5 bg-zinc-600"></div>
                            <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-300">
                                {category}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {snippets
                                .filter((s: Snippet) => s.category === category)
                                .map((snippet: Snippet) => (
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
        </div>
    );
};

interface SnippetCardProps {
    snippet: Snippet;
    isExpanded: boolean;
    onToggle: () => void;
}

const SnippetCard = memo(({ snippet, isExpanded, onToggle }: SnippetCardProps) => {
    const [copied, setCopied] = useState(false);
    const [highlightedHtml, setHighlightedHtml] = useState<string>('');

    useEffect(() => {
        if (!isExpanded || highlightedHtml) return;
        getHighlighter().then((h) => {
            const html = h.codeToHtml(snippet.code, {
                lang: snippet.language,
                theme: 'github-dark',
            });
            setHighlightedHtml(html);
        }).catch(() => setHighlightedHtml(''));
    }, [isExpanded, snippet.code, snippet.language, highlightedHtml]);

    const handleCopy = async (e: React.MouseEvent) => {
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
                    {highlightedHtml ? (
                        <div
                            className="shiki-wrapper overflow-x-auto text-xs"
                            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                        />
                    ) : (
                        <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-400 bg-zinc-950/50">
                            <code>{snippet.code}</code>
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
});

SnippetCard.displayName = 'SnippetCard';

export default Snippets;
