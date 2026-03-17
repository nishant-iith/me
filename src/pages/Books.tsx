import { useState, useEffect, useRef, memo } from 'react';
import { Book, User, Quote, ArrowLeft, Terminal, Clock, ArrowRight, CornerDownRight, ExternalLink } from 'lucide-react';
import { PatternDivider } from '~components/SharedLayout';
import { type Book, booksData, groupedBooks } from '../data/books';

interface BookRibbonProps {
    book: Book;
    onClick: (book: Book) => void;
}

const BookRibbon = memo(function BookRibbon({ book, onClick }: BookRibbonProps) {
    return (
        <div
            onClick={() => onClick(book)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(book); } }}
            className={`
                group relative cursor-pointer
                flex items-center justify-between
                py-4 px-6 md:px-8
                bg-[#18181b] border-l-2 border-y border-r border-zinc-800/50
                ${book.bgClass}
                hover:border-l-4 hover:pl-[30px] ${book.colorClass}
                transition-all duration-200 ease-out
            `}
            role="button"
            tabIndex={0}
            aria-label={`Read more about ${book.title}`}
        >
            {/* Left colored accent line (Hover state handles this via border-l-4) */}

            {/* Title Section */}
            <div className="flex flex-col gap-1 z-10">
                <div className="flex items-center gap-3">
                    <h3 className="font-doto font-bold text-lg text-zinc-300 group-hover:text-zinc-100 transition-colors">
                        {book.title}
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 group-hover:text-zinc-400">
                    <span>By {book.author}</span>
                </div>
            </div>

            {/* Right Section (Tags & Arrow) */}
            <div className="flex items-center gap-6 z-10">
                <div className="hidden md:flex gap-2">
                    {book.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded group-hover:border-zinc-700 group-hover:text-zinc-400 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
                <ArrowRight className="text-zinc-600 group-hover:text-zinc-300 transition-colors -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 duration-200" size={18} />
            </div>
        </div>
    );
});

interface ReadingPaneProps {
    book: Book;
    onBack: () => void;
}

function ReadingPane({ book, onBack }: ReadingPaneProps) {
    const backButtonRef = useRef<HTMLButtonElement>(null);

    // Focus the back button when the pane opens
    useEffect(() => {
        backButtonRef.current?.focus();
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onBack();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onBack]);

    return (
        <div
            className="flex flex-col h-full bg-[#0a0a0a] animate-in fade-in zoom-in-95 duration-200 absolute inset-0 z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={book.title}
        >

            {/* Navigation */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
                <button
                    ref={backButtonRef}
                    onClick={onBack}
                    className="hover:bg-zinc-800 p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm font-medium"
                    aria-label="Close book detail and go back to book list"
                >
                    <ArrowLeft size={18} />
                    <span className="font-mono">./stack</span>
                </button>
                <div className="flex items-center gap-3">
                    <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
                        aria-label={`Open ${book.title} in new tab`}
                    >
                        <ExternalLink size={14} />
                        <span>Read Book</span>
                    </a>
                    <div className={`px-3 py-1 rounded border border-zinc-800 bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-400`}>
                        {book.category}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto w-full bg-[#0a0a0a]">
                {/* Ambient Background Glow */}
                <div className={`fixed top-20 right-20 w-96 h-96 ${book.bgClass.replace('group-hover:', '')} rounded-full blur-[120px] opacity-10 pointer-events-none`}></div>

                <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        {book.tags.map((tag: string) => (
                            <span key={tag} className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 mb-6 font-doto tracking-tight leading-none">
                        {book.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-12 text-zinc-500 font-mono text-sm border-b border-zinc-800 pb-8">
                        <User size={14} />
                        <span>{book.author}</span>
                        <span className="text-zinc-700">•</span>
                        <Clock size={14} />
                        <span>{book.date}</span>
                    </div>

                    <div className="bg-zinc-900/50 border-l-2 border-zinc-700 p-6 md:p-8 mb-12">
                        <Quote className="text-zinc-700 mb-4" size={24} />
                        <p className="text-xl md:text-2xl text-zinc-300 font-serif italic leading-relaxed">
                            &ldquo;{book.takeaway}&rdquo;
                        </p>
                    </div>

                    <article className="prose prose-invert prose-lg prose-zinc max-w-none prose-headings:font-doto prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-p:leading-loose font-light">
                        {book.content}
                    </article>
                </div>
            </div>
        </div>
    );
}

export default function Books() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    return (
        <div className="flex flex-col h-[85vh] md:h-[80vh] bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden animate-in fade-in duration-500 shadow-2xl relative">

            {selectedBook && <ReadingPane book={selectedBook} onBack={() => setSelectedBook(null)} />}

            {/* Header */}
            <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0a] shrink-0">
                <div>
                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-zinc-500" />
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 font-doto uppercase tracking-tight">System Logs</h1>
                    </div>
                    <p className="text-zinc-600 text-xs font-mono mt-1 ml-9">Archived knowledge modules.</p>
                </div>
                <div className="flex items-center gap-4 text-zinc-600">
                    <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-500">
                        {booksData.length} modules
                    </div>
                </div>
            </div>

            {/* Scrollable Stack Content */}
            <div className="flex-1 overflow-y-auto p-0 bg-[#0a0a0a]">
                <div className="max-w-5xl mx-auto flex flex-col pt-8 pb-16">

                    {Object.entries(groupedBooks).map(([category, books], idx, arr) => (
                        <div key={category} className="flex flex-col">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 px-8 mb-4">
                                <CornerDownRight size={16} className="text-zinc-600" />
                                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                    {category}
                                </h2>
                            </div>

                            {/* Books Stack - No gaps, looking like a terminal list */}
                            <div className="flex flex-col border-t border-zinc-800">
                                {books.map((book: Book) => (
                                    <BookRibbon key={book.id} book={book} onClick={setSelectedBook} />
                                ))}
                            </div>

                            {idx < arr.length - 1 && <PatternDivider />}
                            {idx === arr.length - 1 && <div className="h-16"></div>}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
