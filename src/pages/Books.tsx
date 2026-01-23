import React, { useState } from 'react';
import { Book, User, Quote, Tag, FileText, ArrowLeft, Terminal, LayoutGrid, List, Search, Clock, Calendar, Hash, ArrowRight, CornerDownRight } from 'lucide-react';

const booksData = [
    {
        id: "clean-code",
        category: "Engineering",
        title: "Clean Code",
        author: "Robert C. Martin",
        tags: ["Craftsmanship", "Best Practices"],
        date: "24 days ago",
        takeaway: "Code is read much more than it is written. Writing clean code is about empathy for the next developer.",
        accent: "blue", // Abstract color name for logic
        colorClass: "group-hover:text-blue-400 group-hover:border-blue-500/50",
        borderClass: "border-blue-500",
        bgClass: "group-hover:bg-blue-500/5",
        content: `### The Boy Scout Rule. Always leave the campground cleaner than you found it.`
    },
    {
        id: "pragmatic",
        category: "Engineering",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        tags: ["Career", "Mastery"],
        date: "1 year ago",
        takeaway: "Don't live with broken windows. Fix bad designs, wrong decisions, and poor code when you see them.",
        accent: "green",
        colorClass: "group-hover:text-emerald-400 group-hover:border-emerald-500/50",
        borderClass: "border-emerald-500",
        bgClass: "group-hover:bg-emerald-500/5",
        content: `### The Broken Window Theory.`
    },
    {
        id: "ddia",
        category: "Engineering",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        tags: ["Architecture", "Systems"],
        date: "Just now",
        takeaway: "Scalability is not a boolean.",
        accent: "purple",
        colorClass: "group-hover:text-purple-400 group-hover:border-purple-500/50",
        borderClass: "border-purple-500",
        bgClass: "group-hover:bg-purple-500/5",
        content: `### Reliability, Scalability, Maintainability.`
    },
    {
        id: "atomic-habits",
        category: "Productivity",
        title: "Atomic Habits",
        author: "James Clear",
        tags: ["Psychology", "Systems"],
        date: "2 months ago",
        takeaway: "You do not rise to the level of your goals. You fall to the level of your systems.",
        accent: "amber",
        colorClass: "group-hover:text-amber-400 group-hover:border-amber-500/50",
        borderClass: "border-amber-500",
        bgClass: "group-hover:bg-amber-500/5",
        content: `### The 1% Rule.`
    },
    {
        id: "deep-work",
        category: "Productivity",
        title: "Deep Work",
        author: "Cal Newport",
        tags: ["Focus", "Career"],
        date: "3 months ago",
        takeaway: "Deep work is a superpower in the 21st century.",
        accent: "rose",
        colorClass: "group-hover:text-rose-400 group-hover:border-rose-500/50",
        borderClass: "border-rose-500",
        bgClass: "group-hover:bg-rose-500/5",
        content: `### The Shallows.`
    },
    {
        id: "psychology-money",
        category: "Finance",
        title: "Psychology of Money",
        author: "Morgan Housel",
        tags: ["Wealth", "Mindset"],
        date: "4 months ago",
        takeaway: "Wealth is what you don't see.",
        accent: "emerald",
        colorClass: "group-hover:text-emerald-400 group-hover:border-emerald-500/50",
        borderClass: "border-emerald-500",
        bgClass: "group-hover:bg-emerald-500/5",
        content: `### Compounding.`
    },
    {
        id: "zero-to-one",
        category: "Business",
        title: "Zero to One",
        author: "Peter Thiel",
        tags: ["Startups", "Strategy"],
        date: "5 months ago",
        takeaway: "Competition is for losers.",
        accent: "cyan",
        colorClass: "group-hover:text-cyan-400 group-hover:border-cyan-500/50",
        borderClass: "border-cyan-500",
        bgClass: "group-hover:bg-cyan-500/5",
        content: `### Monopolies.`
    }
];

// Group books by category
const groupedBooks = booksData.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
}, {});

const BookRibbon = ({ book, onClick }) => (
    <div
        onClick={() => onClick(book)}
        className={`
            group relative cursor-pointer
            flex items-center justify-between
            py-4 px-6 md:px-8
            bg-[#18181b] border-l-2 border-y border-r border-zinc-800/50 
            ${book.bgClass}
            hover:border-l-4 hover:pl-[30px] ${book.colorClass}
            transition-all duration-200 ease-out
        `}
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
                {book.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded group-hover:border-zinc-700 group-hover:text-zinc-400 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
            <ArrowRight className="text-zinc-600 group-hover:text-zinc-300 transition-colors -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 duration-200" size={18} />
        </div>
    </div>
);

const ReadingPane = ({ book, onBack }) => (
    <div className="flex flex-col h-full bg-[#0a0a0a] animate-in fade-in zoom-in-95 duration-200 absolute inset-0 z-50 overflow-hidden">

        {/* Navigation */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
            <button
                onClick={onBack}
                className="hover:bg-zinc-800 p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm font-medium"
            >
                <ArrowLeft size={18} />
                <span className="font-mono">./stack</span>
            </button>
            <div className={`px-3 py-1 rounded border border-zinc-800 bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-400`}>
                {book.category}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto w-full bg-[#0a0a0a]">
            {/* Ambient Background Glow */}
            <div className={`fixed top-20 right-20 w-96 h-96 ${book.bgClass.replace('group-hover:', '')} rounded-full blur-[120px] opacity-10 pointer-events-none`}></div>

            <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    {book.tags.map(tag => (
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
                        "{book.takeaway}"
                    </p>
                </div>

                <article className="prose prose-invert prose-lg prose-zinc max-w-none prose-headings:font-doto prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-p:leading-loose font-light">
                    {book.content}
                </article>
            </div>
        </div>
    </div>
);

const Books = () => {
    const [selectedBook, setSelectedBook] = useState(null);

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

                    {Object.entries(groupedBooks).map(([category, books]) => (
                        <div key={category} className="flex flex-col mb-12">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 px-8 mb-4">
                                <CornerDownRight size={16} className="text-zinc-600" />
                                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest font-mono">
                                    {category}
                                </h2>
                            </div>

                            {/* Books Stack - No gaps, looking like a terminal list */}
                            <div className="flex flex-col border-t border-zinc-800">
                                {books.map(book => (
                                    <BookRibbon key={book.id} book={book} onClick={setSelectedBook} />
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Books;
