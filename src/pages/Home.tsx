import { useState, useEffect, useMemo } from 'react';
import { Github, ExternalLink, ChevronDown, Linkedin, Twitter, BadgeCheck, Briefcase, GraduationCap } from 'lucide-react';
import VisitorCounter from '~components/VisitorCounter';
import { PatternDivider, SectionTitle } from '~components/SharedLayout';
import ContributionGraph from '@/features/github/components/ContributionGraph';

import logoGS from '~assets/logos/gs.png';
import logoOCS from '~assets/logos/ocs.png';
import logo10x from '~assets/logos/10xscale.png';
import logoFCC from '~assets/logos/fcc.png';
import logoPentakod from '~assets/logos/pentakod.png';
import logoIITH from '~assets/logos/iith.png';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* HERO SECTION - Updated to match uploaded image & requests */}
            <section className="flex flex-col gap-5 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-zinc-400 text-sm flex items-center gap-2">
                            Hi, I'm <span className="animate-pulse">👋</span>
                        </span>
                        <div className="flex items-center gap-3">
                            <h1 className="font-doto text-5xl sm:text-6xl font-bold tracking-tight text-zinc-100 uppercase">
                                NISHANT
                            </h1>
                            <BadgeCheck className="text-black fill-zinc-100" size={32} />
                        </div>
                        <TypewriterEffect
                            words={["Based in Hyderabad, India", "Software Engineer", "Student at IIT Hyderabad"]}
                        />
                    </div>

                    {/* Social Links + Visitor Counter - Stacked */}
                    <div className="flex flex-col gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-4 border border-dashed border-zinc-800 p-3 rounded-lg bg-zinc-900/20 backdrop-blur-sm">
                            <SocialLink href="https://github.com/nishant-iith" icon={<Github size={20} />} />
                            <SocialLink href="https://linkedin.com/in/nishant-iith" icon={<Linkedin size={20} />} />
                            <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} />
                        </div>
                        <VisitorCounter />
                    </div>
                </div>
            </section>

            {/* PATTERN DIVIDER - After Hero */}
            <PatternDivider />

            {/* CONTRIBUTION GRAPH */}
            <ContributionGraph />

            {/* PATTERN DIVIDER - After Contribution Graph */}
            <PatternDivider />

            {/* EXPERIENCE SECTION - With Toggle Filter */}
            <ExperienceSection />

            {/* PATTERN DIVIDER - After Experience */}
            <PatternDivider />

            {/* EDUCATION SECTION */}
            <section className="flex flex-col gap-8">
                <SectionTitle title="EDUCATION" />
                <div className="flex flex-col gap-6">
                    <EducationItem
                        school="Indian Institute of Technology, Hyderabad"
                        degree="Bachelor of Technology in Biomedical Engineering"
                        period="2022 - 2026"
                        grade="CGPA: 8.20"
                        logo={logoIITH}
                        courses={{
                            "Computer Science": [
                                "Introduction to Programming",
                                "Data Structures & Applications",
                                "Algorithms and Data Structure Lab",
                                "Introduction to Embedded Systems"
                            ],
                            "AI & Machine Learning": [
                                "Artificial Intelligence",
                                "AI in Biomedicine and Healthcare",
                                "Foundation of Natural Intelligence",
                                "Fundamentals of Medical AI",
                                "Implementations of Natural Intelligence"
                            ],
                            "Mathematics": [
                                "Calculus-I",
                                "Calculus-II",
                                "Elementary Linear Algebra",
                                "Differential Equations",
                                "Probability",
                                "Transform Techniques",
                                "Complex Variables",
                                "Introduction to Statistics",
                                "Numerical Methods"
                            ],
                            "Electrical": [
                                "Introduction to Electrical Engineering",
                                "Basic Electrical Engineering",
                                "Analog and Integrated Circuits",
                                "Linear Systems and Signal",
                                "Control System",
                                "Sensors and Transducers in Health Care",
                                "Neurotechnology & BCI Theory"
                            ]
                        }}
                    />
                </div>
            </section>

            {/* PATTERN DIVIDER - After Education */}
            <PatternDivider />

            {/* PROJECTS SECTION - Grid 2 columns */}
            <section className="flex flex-col gap-8">
                <SectionTitle title="PROJECTS" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ProjectCard
                        title="Data Structures Analysis"
                        status="RESEARCH"
                        desc="Comparative analysis of BST, AVL Trees, and Hashing for efficient storage and retrieval operations. Benchmarked performance with C/C++ implementations."
                        tags={['C++', 'C', 'Algorithms']}
                        href="https://github.com/nishant-iith/data-structure-project"
                    />
                    <ProjectCard
                        title="Job Scheduler"
                        status="SYSTEMS"
                        desc="Advanced CPU job scheduling simulator with FCFS, SJF, Round Robin, and Priority algorithms. Features interactive CLI and performance metrics visualization."
                        tags={['C++', 'OS', 'Algorithms']}
                        href="https://github.com/nishant-iith/job-scheduler"
                    />
                    <ProjectCard
                        title="Portfolio Website"
                        status="FRONTEND"
                        desc="Personal portfolio website built with React, TypeScript, and Tailwind CSS. Features GitHub contributions graph and LeetCode/Codeforces stats integration."
                        tags={['React', 'TypeScript', 'Tailwind']}
                        href="https://github.com/nishant-iith/me"
                    />
                    <ProjectCard
                        title="ML Library"
                        status="ML / CPP"
                        desc="Machine learning library built from scratch in C++. Implements Linear/Logistic Regression, K-Means, and Decision Trees with custom Matrix class."
                        tags={['C++', 'ML', 'Linear Algebra']}
                        href="https://github.com/nishant-iith/Machine_Learning_Library"
                    />
                </div>
            </section>
        </div>
    );
};

interface EducationItemProps {
    school: string;
    degree: string;
    period: string;
    grade: string;
    logo?: string;
    courses?: Record<string, string[]>;
}

const EducationItem = ({ school, degree, period, grade, logo, courses = {} }: EducationItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Get total course count from object
    const totalCourses = Object.values(courses).flat().length;
    const hasCategories = typeof courses === 'object' && !Array.isArray(courses);

    return (
        <div className="flex gap-4 group">
            {/* Left Icon Box */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${school} courses`}
                    className={`w-10 h-10 flex items-center justify-center rounded border border-dashed transition-all duration-300 overflow-hidden ${isOpen ? 'border-zinc-500 bg-zinc-900' : 'border-zinc-800 bg-black/50 hover:border-zinc-700'}`}
                >
                    {logo ? (
                        <img src={logo} alt={school} className="w-full h-full object-cover opacity-90" />
                    ) : (
                        <GraduationCap size={16} className="text-zinc-600" />
                    )}
                </button>
                <div className={`w-px flex-1 border-l border-dashed transition-colors duration-300 my-2 ${isOpen ? 'border-zinc-700' : 'border-zinc-900'}`} />
            </div>

            <div className="flex-1 pb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    className="w-full text-left"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                        <h4 className={`font-mono text-sm font-bold transition-colors ${isOpen ? 'text-zinc-100' : 'text-zinc-200 group-hover:text-zinc-100'}`}>
                            {school}
                        </h4>
                        <span className="font-mono text-xs text-zinc-600 tabular-nums">{period}</span>
                    </div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">{degree}</div>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded border border-dashed border-zinc-800 bg-zinc-900/30 text-[10px] font-mono text-zinc-500">
                            <BadgeCheck size={12} className="text-zinc-600" />
                            <span>{grade}</span>
                        </span>
                        {totalCourses > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
                                <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                {isOpen ? 'Hide' : 'Show'} Courses ({totalCourses})
                            </span>
                        )}
                    </div>
                </button>

                {/* Expandable Courses - Categorized */}
                {totalCourses > 0 && (
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-4">
                                {hasCategories && Object.entries(courses).map(([category, courseList]) => (
                                    <div key={category} className="flex flex-col gap-2">
                                        <h5 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider border-b border-dashed border-zinc-800 pb-1">
                                            {category}
                                        </h5>
                                        <div className="flex flex-wrap gap-1.5">
                                            {courseList.map((course: string) => (
                                                <span
                                                    key={course}
                                                    className="font-mono text-[10px] text-zinc-500 px-2 py-1 bg-zinc-900/30 border border-zinc-800/50 rounded hover:border-zinc-700 hover:text-zinc-400 transition-colors"
                                                >
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* --- COMPONENTS --- */

interface TypewriterEffectProps {
    words: string[];
}

const TypewriterEffect = ({ words }: TypewriterEffectProps) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    // Typing logic
    useEffect(() => {
        if (subIndex === words[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 1000); // Wait before deleting
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <div className="h-6 flex items-center">
            <span className="font-mono text-zinc-400 text-sm sm:text-base">
                {words[index].substring(0, subIndex)}
            </span>
            <span className="w-[2px] h-4 ml-1 bg-blue-500 animate-pulse"></span>
        </div>
    );
};

// PatternDivider and SectionTitle are now in ~components/SharedLayout.tsx
// Re-export for backward compatibility (though all imports should use SharedLayout directly)
export { PatternDivider, SectionTitle } from '~components/SharedLayout';

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
}

const SocialLink = ({ href, icon }: SocialLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${href}`}
        className="text-zinc-500 hover:text-zinc-200 transition-colors"
    >
        {icon}
    </a>
);

interface Experience {
    type: 'corporate' | 'college';
    role: string;
    company: string;
    period: string;
    logo?: string;
    tags: string[];
    description: string[];
}

// Experience data with type classification
const experienceData: Experience[] = [
    {
        type: 'corporate',
        role: "Software Development Engineer (Summer Analyst)",
        company: "Goldman Sachs",
        period: "May 2025 - Jul 2025",
        logo: logoGS,
        tags: ['React', 'Java', 'MongoDB'],
        description: [
            "Developed a full-stack web application to automate internal deployment workflows.",
            "Designed an in-app CSV editor with schema-aware validation using AG Grid.",
            "Tech Stack: React, Java, MongoDB"
        ]
    },
    {
        type: 'corporate',
        role: "Instructor (Remote)",
        company: "10xscale.ai",
        period: "Aug 2024 - Apr 2025",
        logo: logo10x,
        tags: ['Teaching', 'DSA', 'Mentorship'],
        description: [
            "Taught Data Structures and Algorithms to a cohort of 45+ students.",
            "Covered Binary Search, Linked Lists, Trees, and Graphs.",
            "Conducted theoretical and practical coding sessions."
        ]
    },
    {
        type: 'corporate',
        role: "Python Developer Intern",
        company: "Pentakod",
        period: "Jun 2024 - Jul 2024",
        logo: logoPentakod,
        tags: ['Python', 'Network Security', 'Scapy'],
        description: [
            "Part of a team developing a Python-based port scanner with vulnerability detection.",
            "Utilized Python libraries (socket, scapy) to debug and refine the scanner.",
            "Ensured accuracy by comparing results against Nmap and iterating on fixes."
        ]
    },
    {
        type: 'college',
        role: "Outreach Coordinator",
        company: "Office of Career Services",
        period: "May 2025 - Present",
        logo: logoOCS,
        tags: ['Outreach', 'Coordination'],
        description: [
            "Leading outreach efforts for the student body ('25-'26 term).",
            "Served as Internship Coordinator (Jun '24 - May '25) managing corporate relations.",
            "Facilitated internship opportunities and placement drives."
        ]
    },
    {
        type: 'college',
        role: "Head of Operations",
        company: "Finance & Consulting Club",
        period: "Apr 2024 - Apr 2025",
        logo: logoFCC,
        tags: ['Leadership', 'Operations', 'Finance'],
        description: [
            "Managed club operations and corporate outreach for 2+ years.",
            "Served as Sponsorship Coordinator (May '23 - May '24) securing key partnerships.",
            "Started as Associate (Jan '23 - May '23), contributing to foundational activities."
        ]
    }
];

// Experience Section with Toggle
const ExperienceSection = () => {
    const [showAll, setShowAll] = useState<boolean>(false);

    // Sort by period (most recent first)
    const sortedExperience = useMemo(() => [...experienceData].sort((a, b) => {
        const getDate = (period: string) => {
            const months: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
            const match = period.match(/(\w+)\s+(\d{4})/);
            return match ? parseInt(match[2]) * 12 + (months[match[1]] || 0) : 0;
        };
        return getDate(b.period) - getDate(a.period);
    }), []);

    const filteredExperience = useMemo(() =>
        showAll ? sortedExperience : sortedExperience.filter(exp => exp.type === 'corporate'),
    [showAll, sortedExperience]);

    return (
        <section className="flex flex-col gap-8">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between border-b border-dashed border-zinc-800 pb-3">
                <h2 className="font-mono text-xs text-zinc-500 tracking-widest flex items-center gap-2">
                    <span className="text-[10px] text-zinc-700">//</span>
                    EXPERIENCE
                </h2>

                {/* Toggle Switch */}
                <button
                    onClick={() => setShowAll(!showAll)}
                    aria-pressed={showAll}
                    aria-label={showAll ? 'Hide college experiences' : 'Show college experiences'}
                    className="flex items-center gap-2 group"
                >
                    <span className="font-mono text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        + College
                    </span>
                    <div className={`relative w-8 h-4 rounded-full border transition-all duration-300 ${showAll ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-900 border-zinc-800'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${showAll ? 'right-0.5 bg-white' : 'left-0.5 bg-zinc-600'}`}></div>
                    </div>
                </button>
            </div>

            {/* Experience Items */}
            <div className="flex flex-col gap-6">
                {filteredExperience.map((exp) => (
                    <ExperienceItem
                        key={`${exp.company}-${exp.period}`}
                        role={exp.role}
                        company={exp.company}
                        period={exp.period}
                        logo={exp.logo}
                        tags={exp.tags}
                        description={exp.description}
                    />
                ))}
            </div>
        </section>
    );
};

interface ExperienceItemProps {
    role: string;
    company: string;
    period: string;
    description: string | string[];
    tags?: string[];
    logo?: string;
}

const ExperienceItem = ({ role, company, period, description, tags, logo }: ExperienceItemProps) => {
    // Default expanded as requested
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex gap-4 group">
            {/* Left Icon Box */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${company} details`}
                    className={`w-10 h-10 flex items-center justify-center rounded border border-dashed transition-all duration-300 overflow-hidden ${isOpen ? 'border-zinc-500 bg-zinc-900' : 'border-zinc-800 bg-black hover:border-zinc-700'}`}
                >
                    {logo ? (
                        <img src={logo} alt={company} className="w-full h-full object-cover opacity-90" />
                    ) : (
                        <Briefcase size={16} className={isOpen ? 'text-zinc-200' : 'text-zinc-600'} />
                    )}
                </button>
                <div className={`w-px flex-1 border-l border-dashed transition-colors duration-300 my-2 ${isOpen ? 'border-zinc-700' : 'border-zinc-900'}`} />
            </div>

            <div className="flex-1 pb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    className="w-full text-left"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                        <h4 className={`font-mono text-sm font-bold transition-colors ${isOpen ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                            {role}
                        </h4>
                        <span className="font-mono text-xs text-zinc-600 tabular-nums">{period}</span>
                    </div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">{company}</div>
                </button>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        {/* Description as Bullet Points */}
                        <ul className="flex flex-col gap-1.5 mb-4 list-none">
                            {Array.isArray(description) ? description.map((item: string) => (
                                <li key={item} className="font-mono text-zinc-400 text-[11px] leading-relaxed flex items-start gap-2">
                                    <span className="mt-1.5 min-w-[3px] min-h-[3px] w-[3px] h-[3px] bg-zinc-600 rounded-full block"></span>
                                    {item}
                                </li>
                            )) : (
                                <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-lg mb-3">{description}</p>
                            )}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                            {tags && tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-900/50 border border-zinc-800 text-zinc-500 rounded hover:border-zinc-700 hover:text-zinc-300 transition-colors cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProjectCardProps {
    title: string;
    status: string;
    desc: string;
    tags: string[];
    href: string;
}

const ProjectCard = ({ title, status, desc, tags, href }: ProjectCardProps) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
    >
        <div className="h-full border border-dashed border-zinc-800 rounded-lg p-1 bg-black/20 hover:bg-white/[0.02] hover:border-zinc-600 transition-all duration-300 flex flex-col">
            {/* Browser Mockup Header */}
            <div className="h-6 border-b border-dashed border-zinc-800 flex items-center px-3 gap-1.5 bg-zinc-900/20 rounded-t-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-500/70 transition-colors"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/70 transition-colors"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500/70 transition-colors"></div>
            </div>

            <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-geist text-base font-bold text-zinc-300 group-hover:text-white transition-colors">
                        {title}
                    </h4>
                    <span className="text-[9px] font-mono tracking-wider text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700/50">
                        {status}
                    </span>
                </div>

                <p className="font-sans text-sm text-zinc-400 leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors">
                    {desc}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex gap-2">
                        {tags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={`${tag}-${index}`} className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
    </a>
);

export default Home;
