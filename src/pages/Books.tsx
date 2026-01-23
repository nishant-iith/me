import React, { useState } from 'react';
import { Book, User, Quote, ArrowLeft, Terminal, Clock, ArrowRight, CornerDownRight } from 'lucide-react';
import { PatternDivider } from './Home';

interface Book {
    id: string;
    category: string;
    title: string;
    author: string;
    tags: string[];
    date: string;
    takeaway: string;
    accent: string;
    colorClass: string;
    borderClass: string;
    bgClass: string;
    content: string;
}

const booksData: Book[] = [
    {
        id: "sicp",
        category: "Programming",
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson & Gerald Jay Sussman",
        tags: ["Functional", "Recursion", "Lisp"],
        date: "Archived",
        takeaway: "Don’t be the person who “never quite understood” something like recursion. Mastering it opens doors to complex problem solving.",
        accent: "blue",
        colorClass: "group-hover:text-blue-400 group-hover:border-blue-500/50",
        borderClass: "border-blue-500",
        bgClass: "group-hover:bg-blue-500/5",
        content: `### Brian Harvey’s Berkeley CS 61A
This book is often called the "Wizard Book" and is a foundational text for computer science that teaches how to build complex systems from simple building blocks.`
    },
    {
        id: "csapp",
        category: "Computer Architecture",
        title: "Computer Systems: A Programmer's Perspective",
        author: "Randal Bryant & David O'Hallaron",
        tags: ["Binary", "Memory", "CPU"],
        date: "Archived",
        takeaway: "If you don’t have a solid mental model of how a computer actually works, all of your higher-level abstractions will be brittle.",
        accent: "green",
        colorClass: "group-hover:text-emerald-400 group-hover:border-emerald-500/50",
        borderClass: "border-emerald-500",
        bgClass: "group-hover:bg-emerald-500/5",
        content: `### Berkeley CS 61C
Understanding the hardware-software interface is critical for writing efficient and secure code. This book bridges the gap between high-level code and machine reality.`
    },
    {
        id: "adm",
        category: "Algorithms and Data Structures",
        title: "The Algorithm Design Manual",
        author: "Steven Skiena",
        tags: ["DSA", "Analysis", "Complexity"],
        date: "Archived",
        takeaway: "If you don’t know how to use ubiquitous data structures like stacks, queues, trees, and graphs, you won’t be able to solve challenging problems.",
        accent: "purple",
        colorClass: "group-hover:text-purple-400 group-hover:border-purple-500/50",
        borderClass: "border-purple-500",
        bgClass: "group-hover:bg-purple-500/5",
        content: `### Steven Skiena’s lectures
Algorithms are the toolkit of every programmer. This book focuses on practical design and implementation over pure mathematical proofs.`
    },
    {
        id: "mcs",
        category: "Math for CS",
        title: "Mathematics for Computer Science",
        author: "Eric Lehman & Tom Leighton",
        tags: ["Discrete", "Probability", "Logic"],
        date: "Archived",
        takeaway: "CS is basically a runaway branch of applied math, so learning math will give you a competitive advantage.",
        accent: "amber",
        colorClass: "group-hover:text-amber-400 group-hover:border-amber-500/50",
        borderClass: "border-amber-500",
        bgClass: "group-hover:bg-amber-500/5",
        content: `### Tom Leighton’s MIT 6.042J
The language of programming is logic and mathematics. This book provides the foundational tools needed for rigorous algorithmic analysis.`
    },
    {
        id: "ostep",
        category: "Operating Systems",
        title: "Operating Systems: Three Easy Pieces",
        author: "Remzi & Andrea Arpaci-Dusseau",
        tags: ["Kernel", "Memory", "Scheduling"],
        date: "Archived",
        takeaway: "Most of the code you write is run by an operating system, so you should know how those interact.",
        accent: "rose",
        colorClass: "group-hover:text-rose-400 group-hover:border-rose-500/50",
        borderClass: "border-rose-500",
        bgClass: "group-hover:bg-rose-500/5",
        content: `### Berkeley CS 162
Virtualized CPUs, memory, and concurrency. This book explains the magic that happens between your code and the hardware.`
    },
    {
        id: "networking",
        category: "Computer Networking",
        title: "Computer Networking: A Top-Down Approach",
        author: "James Kurose & Keith Ross",
        tags: ["HTTP", "TCP/IP", "DNS"],
        date: "Archived",
        takeaway: "The Internet turned out to be a big deal: understand how it works to unlock its full potential.",
        accent: "teal",
        colorClass: "group-hover:text-teal-400 group-hover:border-teal-500/50",
        borderClass: "border-teal-500",
        bgClass: "group-hover:bg-teal-500/5",
        content: `### Stanford CS 144
Starting from the Application Layer, this book unravels the mystery of how bits move across the globe in milliseconds.`
    },
    {
        id: "dbms",
        category: "Databases",
        title: "Readings in Database Systems",
        author: "Peter Bailis, Joseph Hellerstein & Michael Stonebraker",
        tags: ["SQL", "ACID", "Storage"],
        date: "Archived",
        takeaway: "Data is at the heart of most significant programs, but few understand how database systems actually work under the hood.",
        accent: "indigo",
        colorClass: "group-hover:text-indigo-400 group-hover:border-indigo-500/50",
        borderClass: "border-indigo-500",
        bgClass: "group-hover:bg-indigo-500/5",
        content: `### Joe Hellerstein’s Berkeley CS 186
The "Red Book" is a collection of seminal papers that shaped the field of database systems.`
    },
    {
        id: "compilers",
        category: "Languages and Compilers",
        title: "Crafting Interpreters",
        author: "Robert Nystrom",
        tags: ["Parsing", "AST", "VM"],
        date: "Archived",
        takeaway: "If you understand how languages and compilers actually work, you’ll write better code and learn new languages more easily.",
        accent: "orange",
        colorClass: "group-hover:text-orange-400 group-hover:border-orange-500/50",
        borderClass: "border-orange-500",
        bgClass: "group-hover:bg-orange-500/5",
        content: `### Alex Aiken’s course on edX
A hands-on guide to building your own programming language from scratch. Beautifully illustrated and deeply insightful.`
    },
    {
        id: "distributed",
        category: "Distributed Systems",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        tags: ["Partitioning", "Consensus", "Availability"],
        date: "Archived",
        takeaway: "These days, most systems are distributed systems. Understanding consistency trade-offs is non-negotiable.",
        accent: "pink",
        colorClass: "group-hover:text-pink-400 group-hover:border-pink-500/50",
        borderClass: "border-pink-500",
        bgClass: "group-hover:bg-pink-500/5",
        content: `### MIT 6.824
The definitive guide to the architecture of modern data systems. Bridges the gap between theory and real-world implementation.`
    }
];

// Group books by category
const groupedBooks = booksData.reduce((acc: Record<string, Book[]>, book: Book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
}, {});

interface BookRibbonProps {
    book: Book;
    onClick: (book: Book) => void;
}

const BookRibbon: React.FC<BookRibbonProps> = ({ book, onClick }) => (
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

interface ReadingPaneProps {
    book: Book;
    onBack: () => void;
}

const ReadingPane: React.FC<ReadingPaneProps> = ({ book, onBack }) => (
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

const Books: React.FC = () => {
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
};

export default Books;
