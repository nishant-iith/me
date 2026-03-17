export interface Book {
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
    url: string;
}

export const booksData: Book[] = [
    {
        id: "sicp",
        category: "Programming",
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson & Gerald Jay Sussman",
        tags: ["Functional", "Recursion", "Lisp"],
        date: "Archived",
        takeaway: "Don't be the person who \"never quite understood\" something like recursion. Mastering it opens doors to complex problem solving.",
        accent: "blue",
        colorClass: "group-hover:text-blue-400 group-hover:border-blue-500/50",
        borderClass: "border-blue-500",
        bgClass: "group-hover:bg-blue-500/5",
        content: `### Brian Harvey's Berkeley CS 61A\nThis book is often called the "Wizard Book" and is a foundational text for computer science that teaches how to build complex systems from simple building blocks.`,
        url: "https://raw.githubusercontent.com/CesarBallardini/sicp-spanish/master/sicp-es.pdf"
    },
    {
        id: "csapp",
        category: "Computer Architecture",
        title: "Computer Systems: A Programmer's Perspective",
        author: "Randal Bryant & David O'Hallaron",
        tags: ["Binary", "Memory", "CPU"],
        date: "Archived",
        takeaway: "If you don't have a solid mental model of how a computer actually works, all of your higher-level abstractions will be brittle.",
        accent: "green",
        colorClass: "group-hover:text-emerald-400 group-hover:border-emerald-500/50",
        borderClass: "border-emerald-500",
        bgClass: "group-hover:bg-emerald-500/5",
        content: `### Berkeley CS 61C\nUnderstanding the hardware-software interface is critical for writing efficient and secure code. This book bridges the gap between high-level code and machine reality.`,
        url: "https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/books/CSAPP_2016.pdf"
    },
    {
        id: "adm",
        category: "Algorithms and Data Structures",
        title: "The Algorithm Design Manual",
        author: "Steven Skiena",
        tags: ["DSA", "Analysis", "Complexity"],
        date: "Archived",
        takeaway: "If you don't know how to use ubiquitous data structures like stacks, queues, trees, and graphs, you won't be able to solve challenging problems.",
        accent: "purple",
        colorClass: "group-hover:text-purple-400 group-hover:border-purple-500/50",
        borderClass: "border-purple-500",
        bgClass: "group-hover:bg-purple-500/5",
        content: `### Steven Skiena's lectures\nAlgorithms are the toolkit of every programmer. This book focuses on practical design and implementation over pure mathematical proofs.`,
        url: "https://moodle2.cs.uvigo.es/pluginfile.php/14189/mod_resource/content/1/%5BSkiena,%20Steven%5D%20The%20Algorithm%20Design%20Manual%20-%202nd%20edition.pdf"
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
        content: `### Tom Leighton's MIT 6.042J\nThe language of programming is logic and mathematics. This book provides the foundational tools needed for rigorous algorithmic analysis.`,
        url: "https://courses.csail.mit.edu/6.042/spring18/mcs.pdf"
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
        content: `### Berkeley CS 162\nVirtualized CPUs, memory, and concurrency. This book explains the magic that happens between your code and the hardware.`,
        url: "https://techiefood4u.files.wordpress.com/2020/02/operating_systems_three_easy_pieces.pdf"
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
        content: `### Stanford CS 144\nStarting from the Application Layer, this book unravels the mystery of how bits move across the globe in milliseconds.`,
        url: "https://qige.io/network/Kurose-7.pdf"
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
        content: `### Joe Hellerstein's Berkeley CS 186\nThe "Red Book" is a collection of seminal papers that shaped the field of database systems.`,
        url: "http://www.redbook.io/pdf/redbook-5th-edition.pdf"
    },
    {
        id: "compilers",
        category: "Languages and Compilers",
        title: "Crafting Interpreters",
        author: "Robert Nystrom",
        tags: ["Parsing", "AST", "VM"],
        date: "Archived",
        takeaway: "If you understand how languages and compilers actually work, you'll write better code and learn new languages more easily.",
        accent: "orange",
        colorClass: "group-hover:text-orange-400 group-hover:border-orange-500/50",
        borderClass: "border-orange-500",
        bgClass: "group-hover:bg-orange-500/5",
        content: `### Alex Aiken's course on edX\nA hands-on guide to building your own programming language from scratch. Beautifully illustrated and deeply insightful.`,
        url: "https://craftinginterpreters.com/contents.html"
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
        content: `### MIT 6.824\nThe definitive guide to the architecture of modern data systems. Bridges the gap between theory and real-world implementation.`,
        url: "https://unidel.edu.ng/focelibrary/books/Designing%20Data-Intensive%20Applications%20The%20Big%20Ideas%20Behind%20Reliable,%20Scalable,%20and%20Maintainable%20Systems%20by%20Martin%20Kleppmann%20(z-lib.org).pdf"
    }
];

export const groupedBooks = booksData.reduce((acc: Record<string, Book[]>, book: Book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
}, {});
