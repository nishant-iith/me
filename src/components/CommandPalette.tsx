import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Book, User, Code, FileText, Github, Linkedin, Mail, ExternalLink, History } from 'lucide-react';

interface Action {
    id: string;
    title: string;
    icon: React.ReactNode;
    shortcut?: string;
    perform: () => void;
}

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const actions: Action[] = [
        {
            id: 'home',
            title: 'Home',
            icon: <Home size={18} />,
            shortcut: 'H',
            perform: () => navigate('/')
        },
        {
            id: 'about',
            title: 'About',
            icon: <User size={18} />,
            shortcut: 'A',
            perform: () => navigate('/about')
        },
        {
            id: 'skills',
            title: 'Skills',
            icon: <Code size={18} />,
            shortcut: 'S',
            perform: () => navigate('/skill')
        },
        {
            id: 'blog',
            title: 'Blog',
            icon: <Book size={18} />,
            shortcut: 'B',
            perform: () => navigate('/blog')
        },
        {
            id: 'toolbox',
            title: 'My Toolbox',
            icon: <Code size={18} />,
            shortcut: 'T',
            perform: () => navigate('/toolbox')
        },
        {
            id: 'timeline',
            title: 'Learning Log',
            icon: <History size={18} />,
            shortcut: 'L',
            perform: () => navigate('/timeline')
        },
        {
            id: 'books',
            title: 'Book Shelf',
            icon: <Book size={18} />,
            shortcut: 'B',
            perform: () => navigate('/books')
        },
        {
            id: 'snippets',
            title: 'Code Snippets',
            icon: <Code size={18} />,
            shortcut: 'C',
            perform: () => navigate('/snippets')
        },
        {
            id: 'resume',
            title: 'Download Resume',
            icon: <FileText size={18} />,
            perform: () => window.open('/Nishant_IITH.pdf', '_blank', 'noopener,noreferrer')
        },
        {
            id: 'github',
            title: 'GitHub',
            icon: <Github size={18} />,
            perform: () => window.open('https://github.com/nishant-iith', '_blank', 'noopener,noreferrer')
        },
        {
            id: 'linkedin',
            title: 'LinkedIn',
            icon: <Linkedin size={18} />,
            perform: () => window.open('https://linkedin.com/in/nishant-iith', '_blank', 'noopener,noreferrer')
        },
        {
            id: 'email',
            title: 'Send Email',
            icon: <Mail size={18} />,
            perform: () => window.location.href = 'mailto:ee22btech11038@iith.ac.in'
        }
    ];

    const filteredActions = actions.filter(action =>
        action.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Tiny delay to ensure rendering
            setTimeout(() => inputRef.current?.focus(), 10);
            setQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    const execute = (action: Action) => {
        setIsOpen(false);
        action.perform();
    };

    const handleInputKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredActions[activeIndex]) {
                execute(filteredActions[activeIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#18181b] border border-dashed border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Bar */}
                <div className="flex items-center px-4 py-3 border-b border-dashed border-zinc-800">
                    <Search size={18} className="text-zinc-600 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command..."
                        className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 text-sm font-mono h-6"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setActiveIndex(0);
                        }}
                        onKeyDown={handleInputKey}
                    />
                    <div className="text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900">
                        ESC
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredActions.length === 0 ? (
                        <div className="px-4 py-8 text-center text-zinc-500 text-sm font-mono">
                            No results found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 px-2">
                            {filteredActions.map((action, index) => (
                                <button
                                    key={action.id}
                                    onClick={() => execute(action)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-colors ${index === activeIndex
                                        ? 'bg-zinc-800/80 text-zinc-100'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={index === activeIndex ? 'text-zinc-100' : 'text-zinc-500'}>
                                            {action.icon}
                                        </span>
                                        <span className="text-sm font-medium">{action.title}</span>
                                    </div>
                                    {action.shortcut && (
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${index === activeIndex
                                            ? 'border-zinc-600 text-zinc-300'
                                            : 'border-zinc-800 text-zinc-600'
                                            }`}>
                                            {action.shortcut}
                                        </span>
                                    )}
                                    {!action.shortcut && (
                                        <ExternalLink size={12} className={`opacity-0 ${index === activeIndex ? 'opacity-50' : ''}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                    <div className="flex gap-3">
                        <span>↑↓ to navigate</span>
                        <span>↵ to select</span>
                    </div>
                    <span>Portfolio v1.0</span>
                </div>
            </div>
        </div>
    );
}
