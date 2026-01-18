import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Github, ExternalLink, ChevronDown, Linkedin, Twitter, BadgeCheck, Briefcase } from 'lucide-react';
import VisitorCounter from '../components/VisitorCounter';

import logoGS from '../assets/logos/gs.png';
import logoOCS from '../assets/logos/ocs.png';
import logo10x from '../assets/logos/10xscale.png';
import logoFCC from '../assets/logos/fcc.png';
import logoPentakod from '../assets/logos/pentakod.png';
import logoIITH from '../assets/logos/iith.png';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* HERO SECTION - Updated to match uploaded image & requests */}
            <section className="flex flex-col gap-5 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-zinc-500 text-sm flex items-center gap-2">
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
                        title="Bi-LSTM Sentiment"
                        status="ML / NLP"
                        desc="Deep learning model for sentiment analysis using Bi-directional LSTMs. Achieved high accuracy on IMDB dataset."
                        tags={['Python', 'Keras', 'NLP']}
                        href="https://github.com/nishant-iith"
                    />
                    <ProjectCard
                        title="CPU Scheduler"
                        status="SYSTEMS"
                        desc="Visual simulation of various CPU scheduling algorithms like FCFS, SJF, and Round Robin."
                        tags={['C++', 'OS', 'Algorithms']}
                        href="https://github.com/nishant-iith"
                    />
                    <ProjectCard
                        title="Cab Booking System"
                        status="DESIGN"
                        desc="Low-level system design for a cab booking platform dealing with concurrency and locking."
                        tags={['C++', 'System Design']}
                        href="https://github.com/nishant-iith"
                    />
                    <ProjectCard
                        title="Distributed File System"
                        status="BACKEND"
                        desc="A simplified distributed file system implementation handling file chunking and replication."
                        tags={['Go', 'Distributed Systems']}
                        href="https://github.com/nishant-iith"
                    />
                </div>
            </section>
        </div>
    );
};

const EducationItem = ({ school, degree, period, grade, logo, courses = {} }) => {
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
                                            {courseList.map((course, i) => (
                                                <span
                                                    key={i}
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

const TypewriterEffect = ({ words }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout = setTimeout(() => setBlink(!blink), 500);
        return () => clearTimeout(timeout);
    }, [blink]);

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
            <span className={`w-[2px] h-4 ml-1 bg-blue-500 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
        </div>
    );
};

export const SectionTitle = ({ title }) => (
    <h3 className="font-mono text-zinc-400 text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-zinc-700 rounded-sm"></span>
        {title}
    </h3>
);

// Horizontal Pattern Divider - matches bilal.works exactly
export const PatternDivider = () => (
    <div className="relative flex bg-[#18181b] h-8 w-[calc(100%+2rem)] sm:w-[calc(100%+5rem)] -mx-4 sm:-mx-10 border-y border-dashed border-zinc-800 overflow-hidden my-8">
        <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
                backgroundImage: 'repeating-linear-gradient(315deg, rgba(82,82,91,0.3) 0px, rgba(82,82,91,0.3) 1px, transparent 1px, transparent 10px)',
                zIndex: 0
            }}
        ></div>
    </div>
);

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-500 hover:text-zinc-200 transition-colors"
    >
        {icon}
    </a>
);

// Premium Multi-Platform Contribution Graph
const ContributionGraph = () => {
    const [activeTab, setActiveTab] = useState('github');
    const [data, setData] = useState({ github: null, leetcode: null, codeforces: null });
    const [extraStats, setExtraStats] = useState({
        github: { label: 'Contributions', value: null },
        leetcode: { label: 'Questions Solved', value: null },
        codeforces: { label: 'Rating', value: null, subLabel: null }
    });
    const [loading, setLoading] = useState({ github: true, leetcode: true, codeforces: true });
    const [error, setError] = useState({ github: null, leetcode: null, codeforces: null });
    const [hoveredDay, setHoveredDay] = useState(null);

    // Premium Monochrome Palette
    // 0: Empty (zinc-900/50), 1: zinc-800, 2: zinc-600, 3: zinc-400, 4: zinc-100 (brightest)
    const levels = ['rgba(39, 39, 42, 0.4)', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'];

    const platforms = {
        github: { name: 'GitHub', icon: '⬡', username: 'nishant-iith' },
        leetcode: { name: 'LeetCode', icon: '◧', username: 'Nishant-iith' },
        codeforces: { name: 'Codeforces', icon: '◉', username: 'so-called-iitian' }
    };

    // Helper for caching API responses (Safe JSON parsing)
    const fetchWithCache = async (key, url, duration = 24 * 60 * 60 * 1000) => {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < duration) return data;
            }
        } catch (e) {
            console.warn('Cache parsing failed', e);
            localStorage.removeItem(key);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
            return data;
        } catch (error) { throw error; }
    };

    // Fetch data for all platforms on mount
    useEffect(() => {
        const CACHE_DURATION = 24 * 60 * 60 * 1000;

        // GitHub Data
        fetchWithCache('contrib_github', 'https://github-contributions-api.jogruber.de/v4/nishant-iith?y=last', CACHE_DURATION)
            .then(result => {
                setData(prev => ({ ...prev, github: result }));
                setExtraStats(prev => ({ ...prev, github: { label: 'Contributions', value: result.total?.lastYear } }));
            })
            .catch(err => setError(prev => ({ ...prev, github: err.message })))
            .finally(() => setLoading(prev => ({ ...prev, github: false })));

        // LeetCode Data (Calendar + Solved Stats)
        Promise.all([
            fetchWithCache('contrib_leetcode', 'https://alfa-leetcode-api.onrender.com/Nishant-iith/calendar', CACHE_DURATION),
            fetchWithCache('stats_leetcode', 'https://alfa-leetcode-api.onrender.com/Nishant-iith/solved', CACHE_DURATION)
        ])
            .then(([calendarResult, statsResult]) => {
                // Process Calendar
                const calendar = calendarResult.submissionCalendar ? JSON.parse(calendarResult.submissionCalendar) : {};
                const contributions = Object.entries(calendar).map(([ts, count]) => ({
                    date: new Date(parseInt(ts) * 1000).toISOString().split('T')[0],
                    count: parseInt(count)
                }));

                setData(prev => ({ ...prev, leetcode: { contributions, total: calendarResult.totalActiveDays || contributions.length } }));

                // Set Extra Stats (Solved Count)
                setExtraStats(prev => ({
                    ...prev,
                    leetcode: { label: 'Questions Solved', value: statsResult.solvedProblem }
                }));
            })
            .catch(err => setError(prev => ({ ...prev, leetcode: err.message })))
            .finally(() => setLoading(prev => ({ ...prev, leetcode: false })));

        // Codeforces Data (Status + User Info)
        Promise.all([
            fetchWithCache('contrib_codeforces', 'https://codeforces.com/api/user.status?handle=so-called-iitian&from=1&count=10000', CACHE_DURATION),
            fetchWithCache('stats_codeforces', 'https://codeforces.com/api/user.info?handles=so-called-iitian', CACHE_DURATION)
        ])
            .then(([statusResult, infoResult]) => {
                if (statusResult.status === 'OK') {
                    const dateMap = {};
                    statusResult.result.forEach(sub => {
                        const dateStr = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
                        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
                    });
                    const contributions = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    const total = contributions.filter(c => new Date(c.date) >= oneYearAgo).reduce((s, d) => s + d.count, 0);
                    setData(prev => ({ ...prev, codeforces: { contributions, total } }));
                }

                if (infoResult.status === 'OK' && infoResult.result.length > 0) {
                    const user = infoResult.result[0];
                    setExtraStats(prev => ({
                        ...prev,
                        codeforces: {
                            label: 'Rating',
                            value: user.rating,
                            subLabel: user.rank ? user.rank.replace(/^\w/, c => c.toUpperCase()) : null
                        }
                    }));
                }
            })
            .catch(err => setError(prev => ({ ...prev, codeforces: err.message })))
            .finally(() => setLoading(prev => ({ ...prev, codeforces: false })));
    }, []);

    const getLevel = (count) => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    };

    const processContributions = (platformData, platform) => {
        if (!platformData) return { weeks: [], monthLabels: [] };

        const contribMap = {};
        const contributions = platform === 'github' ? platformData.contributions : platformData.contributions || [];

        contributions.forEach(day => {
            contribMap[day.date] = day.count;
        });

        const today = new Date();
        const weeks = [];
        const monthLabels = [];
        let currentMonth = -1;

        for (let w = 51; w >= 0; w--) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (w * 7 + (6 - d)));
                const dateStr = date.toISOString().split('T')[0];
                const count = contribMap[dateStr] || 0;
                week.push({ date: dateStr, count, level: getLevel(count, platform) });

                if (d === 0) {
                    const month = date.getMonth();
                    if (month !== currentMonth) {
                        monthLabels.push({ week: 51 - w, month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month] });
                        currentMonth = month;
                    }
                }
            }
            weeks.push(week);
        }

        return { weeks, monthLabels };
    };

    const currentData = data[activeTab];
    const currentStats = extraStats[activeTab];
    const isLoading = loading[activeTab];
    const hasError = error[activeTab];
    const { weeks, monthLabels } = processContributions(currentData, activeTab);

    return (
        <section className="flex flex-col gap-4 relative">
            {/* Header: Tabs & Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3">
                <div className="flex p-1 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                    {Object.entries(platforms).map(([key, platform]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-300 ${activeTab === key
                                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                }`}
                        >
                            <span>{platform.icon}</span>
                            {platform.name}
                        </button>
                    ))}
                </div>

            </div>

            {/* Calendar Container */}
            <div className="relative border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-xl p-4 overflow-hidden group">
                {/* Month Labels */}
                <div className="flex mb-2 relative h-4 w-full">
                    {monthLabels.map((m, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-mono text-zinc-500 absolute top-0"
                            style={{ left: `${(m.week / 52) * 100}%` }}
                        >
                            {m.month}
                        </span>
                    ))}
                </div>

                {/* Heatmap Grid */}
                {isLoading ? (
                    <div className="h-[100px] flex items-center justify-center">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                ) : hasError || weeks.length === 0 ? (
                    <div className="h-[100px] flex items-center justify-center text-xs font-mono text-zinc-600">
                        Unable to load data
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <svg viewBox={`0 0 ${52 * 13} ${7 * 13}`} className="min-w-[700px] w-full h-auto block select-none">
                            {weeks.map((week, w) => (
                                <g key={w} transform={`translate(${w * 13}, 0)`}>
                                    {week.map((day, d) => (
                                        <rect
                                            key={d}
                                            x="0"
                                            y={d * 13}
                                            width="10"
                                            height="10"
                                            fill={levels[day.level]}
                                            rx="2.5"
                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                            onMouseEnter={(e) => {
                                                const rect = e.target.getBoundingClientRect();
                                                setHoveredDay({
                                                    ...day,
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top
                                                });
                                            }}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        />
                                    ))}
                                </g>
                            ))}
                        </svg>
                    </div>
                )}

                {/* Legend */}
                {/* Footer: Stats & Legend */}
                <div className="flex items-end justify-between mt-2">
                    {/* Stats Display (Left) */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-doto text-zinc-100 tracking-tight">
                            {isLoading ? '-' : (currentStats.value ?? '-').toLocaleString()}
                        </span>
                        {currentStats.subLabel && (
                            <span className="text-[10px] font-mono text-zinc-400">
                                ({currentStats.subLabel})
                            </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider ml-1">
                            {currentStats.label}
                        </span>
                    </div>

                    {/* Legend (Right) */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-600">Less</span>
                        {levels.map((color, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        ))}
                        <span className="text-[10px] font-mono text-zinc-600">More</span>
                    </div>
                </div>

                {/* Custom Floating Tooltip */}
                {hoveredDay && (
                    <div
                        className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap"
                        style={{ left: hoveredDay.x, top: hoveredDay.y - 4 }}
                    >
                        <div className="font-semibold">
                            {hoveredDay.count} {activeTab === 'codeforces' ? 'submissions' : 'contributions'}
                        </div>
                        <div className="text-zinc-500 text-[10px] uppercase font-mono">
                            {new Date(hoveredDay.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// Experience data with type classification
const experienceData = [
    {
        type: 'corporate',
        role: "Software Development Engineer (Summer Analyst)",
        company: "Goldman Sachs",
        period: "May 2025 - Jul 2025",
        logo: logoGS,
        tags: ['React', 'Java', 'MongoDB'],
        description: [
            "Developed a full-stack web application to automate internal deployment workflows.",
            "Reduced manual lead time by ≈99.1% (from ~3 weeks to ~6 hours).",
            "Designed an in-app CSV editor with schema-aware validation using AG Grid."
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
    const [showAll, setShowAll] = useState(false);

    // Sort by period (most recent first)
    const sortedExperience = [...experienceData].sort((a, b) => {
        const getDate = (period) => {
            const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
            const match = period.match(/(\w+)\s+(\d{4})/);
            return match ? parseInt(match[2]) * 12 + (months[match[1]] || 0) : 0;
        };
        return getDate(b.period) - getDate(a.period);
    });

    const filteredExperience = showAll
        ? sortedExperience
        : sortedExperience.filter(exp => exp.type === 'corporate');

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
                    className="flex items-center gap-2 group"
                    title={showAll ? 'Hide college experiences' : 'Show college experiences'}
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
                {filteredExperience.map((exp, idx) => (
                    <ExperienceItem
                        key={idx}
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

const ExperienceItem = ({ role, company, period, description, tags, logo }) => {
    // Default expanded as requested
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex gap-4 group">
            {/* Left Icon Box */}
            <div className="flex flex-col items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
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
                            {Array.isArray(description) ? description.map((item, i) => (
                                <li key={i} className="font-mono text-zinc-500 text-[11px] leading-relaxed flex items-start gap-2">
                                    <span className="mt-1.5 min-w-[3px] min-h-[3px] w-[3px] h-[3px] bg-zinc-600 rounded-full block"></span>
                                    {item}
                                </li>
                            )) : (
                                <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-lg mb-3">{description}</p>
                            )}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                            {tags && tags.map((tag, i) => (
                                <span
                                    key={i}
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

const ProjectCard = ({ title, status, desc, tags, href }) => (
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

                <p className="font-sans text-sm text-zinc-500 leading-relaxed line-clamp-2 group-hover:text-zinc-400 transition-colors">
                    {desc}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex gap-2">
                        {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500">
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
