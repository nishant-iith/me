import { PatternDivider } from '~components/SharedLayout';
import { Briefcase, Trophy, Code, GraduationCap, Rocket, Star, Heart } from 'lucide-react';

interface Milestone {
    date: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    tags: string[];
    align: string;
}

const milestones: Milestone[] = [
    {
        date: "JULY 2026",
        title: "Upcoming: SDE @ DP World",
        desc: "Preparing for the start of my professional journey as a Software Development Engineer at DP World.",
        icon: <Briefcase size={20} />,
        tags: ["Career", "Full-time"],
        align: "right"
    },
    {
        date: "JAN 2026 - PRESENT",
        title: "Self-Taught CS",
        desc: "Deep diving into core Computer Science fundamentals. Exploring systems, architecture, and advanced software engineering independently.",
        icon: <Rocket size={20} />,
        tags: ["Learning", "Growth"],
        align: "left"
    },
    {
        date: "JAN 2026",
        title: "Placed in DP World",
        desc: "Successfully cleared the re-interview and secured a placement at DP World. Turning rejection into redirection.",
        icon: <Trophy size={20} />,
        tags: ["Career", "Success"],
        align: "right"
    },
    {
        date: "DEC 2025",
        title: "Placement Setback",
        desc: "Faced rejections in all placement interviews. A period of heavy reflection, resilience, and persistence.",
        icon: <Briefcase size={20} />,
        tags: ["Career", "Hardship"],
        align: "left"
    },
    {
        date: "NOV 2025",
        title: "Cleared Placement Exams",
        desc: "Cleared 7 out of 10 placement assessment tests, qualifying for multiple top-tier company interviews.",
        icon: <GraduationCap size={20} />,
        tags: ["Exams", "Education"],
        align: "right"
    },
    {
        date: "SEPT 2025",
        title: "Placement Preparation",
        desc: "Intensive preparation phase for final placements, focusing on system design, OS, and core CS subjects.",
        icon: <Code size={20} />,
        tags: ["Prep", "Career"],
        align: "left"
    },
    {
        date: "AUG 2025",
        title: "GS Full-time Rejection",
        desc: "Did not secure a return offer from Goldman Sachs. A tough moment, but one that paved the way for new opportunities.",
        icon: <Briefcase size={20} />,
        tags: ["Career", "Growth"],
        align: "right"
    },
    {
        date: "MAY 2025",
        title: "Goldman Sachs Internship",
        desc: "Joined Goldman Sachs as a Summer Analyst. Learned high-stakes financial engineering and corporate culture at scale.",
        icon: <Briefcase size={20} />,
        tags: ["Internship", "Finance"],
        align: "left"
    },
    {
        date: "JAN 2025",
        title: "Horizon '25 (FCC)",
        desc: "Served as Operations Head for Horizon, the flagship annual event of the Finance and Consulting Club (24-25 tenure).",
        icon: <Star size={20} />,
        tags: ["Leadership", "FCC"],
        align: "right"
    },
    {
        date: "AUG 2024",
        title: "Instructor @ 10xScale.ai",
        desc: "Started teaching DSA and mentoring students. Helping others bridge the gap from theory to code.",
        icon: <Star size={20} />,
        tags: ["Teaching", "Leadership"],
        align: "left"
    },
    {
        date: "AUG 2024",
        title: "Cracked GS Interview",
        desc: "Successfully secured a Summer Analyst role at Goldman Sachs after a rigorous and competitive selection process.",
        icon: <Rocket size={20} />,
        tags: ["Achievement", "Career"],
        align: "right"
    },
    {
        date: "JULY 2024",
        title: "Pentakod Internship",
        desc: "Interned at Pentakod, focusing on technical implementation and exploring real-world engineering challenges.",
        icon: <Briefcase size={20} />,
        tags: ["Internship", "Engineering"],
        align: "left"
    },
    {
        date: "MAY 2024",
        title: "Internship Prep",
        desc: "Intensive focus on advanced coding patterns and refining my problem-solving approach for top tier companies.",
        icon: <Code size={20} />,
        tags: ["Prep", "Growth"],
        align: "right"
    },
    {
        date: "JAN 2024",
        title: "DSA Mastery",
        desc: "Mastered complex data structures and performance-critical algorithms, building a solid engineering foundation.",
        icon: <Code size={20} />,
        tags: ["DSA", "Coding"],
        align: "left"
    },
    {
        date: "JULY 2023",
        title: "Python & ML Basics",
        desc: "Explored the power of Python and dived into Machine Learning fundamentals to understand data-driven systems.",
        icon: <Code size={20} />,
        tags: ["Python", "ML"],
        align: "right"
    },
    {
        date: "NOV 2022",
        title: "Hello World in C",
        desc: "My first real program. The point where I fell in love with logic and computer science.",
        icon: <Heart size={20} />,
        tags: ["Origin", "C"],
        align: "left"
    },
    {
        date: "OCT 2022",
        title: "Joined IIT Hyderabad",
        desc: "Began my engineering journey at IIT-H, embarking on a path of innovation and technical excellence.",
        icon: <GraduationCap size={20} />,
        tags: ["Education", "IITH"],
        align: "right"
    }
];

interface TimelineItemProps {
    data: Milestone;
    index: number;
}

function TimelineItem({ data, index }: TimelineItemProps) {
    const isLeft = index % 2 === 0;

    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 w-full relative ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} ${index > 0 ? 'md:-mt-24' : ''}`}>

            {/* Content Card */}
            <div className={`w-full md:w-1/2 flex ${isLeft ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'}`}>
                <div className="bg-zinc-900/40 border border-dashed border-zinc-800 p-6 rounded-xl hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 w-full max-w-sm group relative">

                    {/* Connector Line (Mobile hidden, Desktop only) */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 border-t border-dashed border-zinc-700 ${isLeft ? '-right-12' : '-left-12'}`}></div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-zinc-500 text-xs px-2 py-1 bg-zinc-950 rounded border border-zinc-800">
                            {data.date}
                        </span>
                        <div className="p-1.5 bg-zinc-950 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-blue-400 transition-colors">
                            {data.icon}
                        </div>
                    </div>
                    <h3 className="font-doto text-lg text-zinc-100 mb-2">{data.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                        {data.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag: string) => (
                            <span key={tag} className="text-[10px] font-mono text-zinc-600 bg-zinc-950/50 px-1.5 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Node */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-zinc-950 border border-dashed border-zinc-700 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
            </div>

            {/* Empty space for the other side */}
            <div className="hidden md:block w-1/2"></div>

            {/* Mobile Vertical Line Fix (hidden on desktop) */}
            <div className="absolute left-8 top-8 bottom-0 w-px border-l border-dashed border-zinc-800 md:hidden -z-10"></div>
        </div>
    );
};

export default function Timeline() {
    return (
        <div className="flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-doto text-4xl font-bold tracking-tight text-zinc-100 uppercase">
                    LEARNING LOG
                </h1>
                <p className="text-zinc-500 font-mono text-sm max-w-md">
                    A chronological log of my journey, milestones, and the dots I've connected along the way.
                </p>
            </div>

            <PatternDivider />

            <div className="relative flex flex-col gap-4 pb-12">
                {/* Center Vertical Line (Desktop) */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-zinc-800 -translate-x-1/2 md:-translate-x-px"></div>

                {milestones.map((item: Milestone, index: number) => (
                    <TimelineItem key={`${item.date}-${item.title}`} data={item} index={index} />
                ))}
            </div>

            <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                // The journey is just getting started
            </div>
        </div>
    );
}
