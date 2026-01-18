import React from 'react';
import { SectionTitle, PatternDivider } from './Home';
import { Briefcase, Trophy, Code, GraduationCap, Rocket, Star, Heart } from 'lucide-react';

const milestones = [
    {
        date: "2025",
        title: "Upcoming: SDE at Goldman Sachs",
        desc: "Preparing to join Goldman Sachs as a Summer Analyst. Excited to work on large-scale financial challenges.",
        icon: <Briefcase size={20} />,
        tags: ["Career", "Internship"],
        align: "right"
    },
    {
        date: "2024",
        title: "Instructor @ 10xscale.ai",
        desc: "Mentored 45+ students in DSA. It was fulfilling to help others grasp complex algorithms like Graphs and DP.",
        icon: <Star size={20} />,
        tags: ["Teaching", "Community"],
        align: "left"
    },
    {
        date: "2024",
        title: "Pentakod Internship",
        desc: "dove deep into Network Security. Built a Python port scanner and learned a ton about socket programming.",
        icon: <Code size={20} />,
        tags: ["Internship", "Security"],
        align: "right"
    },
    {
        date: "2023",
        title: "Head of Operations @ FCC",
        desc: "Took a leadership role at the Finance & Consulting Club. Managed corporate relations and large-scale events.",
        icon: <Briefcase size={20} />,
        tags: ["Leadership", "Management"],
        align: "left"
    },
    {
        date: "2022",
        title: "Joined IIT Hyderabad",
        desc: "The beginning of my engineering journey. Majoring in Biomedical Engineering with a strong passion for CS.",
        icon: <GraduationCap size={20} />,
        tags: ["Education", "Milestone"],
        align: "right"
    },
    {
        date: "2020",
        title: "Hello World",
        desc: "Wrote my first line of Python code. The moment I realized I could build things from scratch.",
        icon: <Heart size={20} />,
        tags: ["Origin", "Coding"],
        align: "left"
    }
];

const TimelineItem = ({ data, index }) => {
    const isLeft = index % 2 === 0;

    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 w-full relative ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

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
                        {data.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-mono text-zinc-600 bg-zinc-950/50 px-1.5 py-0.5 rounded">
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

const Timeline = () => {
    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2 pt-4">
                <h1 className="font-doto text-4xl font-bold tracking-tight text-zinc-100 uppercase">
                    LEARNING LOG
                </h1>
                <p className="text-zinc-500 font-mono text-sm max-w-md">
                    A chronological log of my journey, milestones, and the dots I've connected along the way.
                </p>
            </div>

            <PatternDivider />

            <div className="relative flex flex-col gap-12 py-8">
                {/* Center Vertical Line (Desktop) */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-zinc-800 -translate-x-1/2 md:-translate-x-px"></div>

                {milestones.map((item, index) => (
                    <TimelineItem key={index} data={item} index={index} />
                ))}
            </div>

            <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                // The journey is just getting started
            </div>
        </div>
    );
};

export default Timeline;
