import { useState, useMemo, useCallback } from 'react';
import { useGithubContributions } from '@/features/github/hooks/useGithubContributions';
import { useLeetCodeStats } from '@/features/leetcode/hooks/useLeetCodeStats';
import { useCodeforcesData } from '@/features/codeforces/hooks/useCodeforcesData';

// Types for contribution data
interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ContributionWeek {
    days: ContributionDay[];
}

interface MonthLabel {
    weekIndex: number;
    month: string;
}

// Premium Multi-Platform Contribution Graph
const ContributionGraph = () => {
    const [activeTab, setActiveTab] = useState<'github' | 'leetcode' | 'codeforces'>('github');
    const [hoveredDay, setHoveredDay] = useState<ContributionDay & { x: number; y: number } | null>(null);

    const { data: githubData, isLoading: githubLoading } = useGithubContributions();
    const { data: leetcodeData, isLoading: leetcodeLoading } = useLeetCodeStats();
    const { data: codeforcesData, isLoading: codeforcesLoading } = useCodeforcesData();

    const isLoading = (activeTab === 'github' && githubLoading)
        || (activeTab === 'leetcode' && leetcodeLoading)
        || (activeTab === 'codeforces' && codeforcesLoading);

    // Premium Monochrome Palette
    const levels = useMemo(() =>
        ['rgba(39, 39, 42, 0.4)', '#27272a', '#52525b', '#a1a1aa', '#f4f4f5'],
    []);

    const platforms = useMemo(() => ({
        github: { name: 'GitHub', icon: '⬡', username: 'nishant-iith' },
        leetcode: { name: 'LeetCode', icon: '◧', username: 'Nishant-iith' },
        codeforces: { name: 'Codeforces', icon: '◉', username: 'so-called-iitian' }
    }), []);

    const getLevel = useCallback((count: number): number => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    }, []);

    const processContributions = useCallback((platformData: { contributions?: Array<{ date: string; count: number }> } | null): { weeks: ContributionWeek[]; monthLabels: MonthLabel[] } => {
        if (!platformData) return { weeks: [], monthLabels: [] };

        const contribMap: Record<string, number> = {};
        const contributions = platformData.contributions || [];

        contributions.forEach((day) => {
            contribMap[day.date] = day.count;
        });

        const today = new Date();
        const weeks: ContributionWeek[] = [];
        const monthLabels: MonthLabel[] = [];
        let lastMonth = -1;

        // Create 53 weeks to ensure coverage of a full year (364 days + current partial week)
        for (let w = 0; w < 53; w++) {
            const week: ContributionDay[] = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                // Calculate date backwards from today
                date.setDate(date.getDate() - ((52 - w) * 7 + (6 - d)));
                const dateStr = date.toISOString().split('T')[0];
                const count = contribMap[dateStr] || 0;
                week.push({ date: dateStr, count, level: getLevel(count) });

                // If Sunday (first day of week), check if we should add a month label
                if (d === 0) {
                    const month = date.getMonth();
                    if (month !== lastMonth) {
                        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
                        monthLabels.push({ weekIndex: w, month: monthName });
                        lastMonth = month;
                    }
                }
            }
            weeks.push({ days: week });
        }

        return { weeks, monthLabels };
    }, [getLevel]);

    // Prepare platform-specific data and stats
    const getPlatformData = useCallback(() => {
        switch (activeTab) {
            case 'github':
                return {
                    data: githubData,
                    stats: { label: 'Contributions', value: githubData.totalContributions }
                };
            case 'leetcode':
                return {
                    data: leetcodeData,
                    stats: { label: 'Questions Solved', value: leetcodeData.solvedProblem }
                };
            case 'codeforces':
                return {
                    data: codeforcesData,
                    stats: { label: 'Rating', value: codeforcesData.rating, subLabel: codeforcesData.rank }
                };
        }
    }, [activeTab, githubData, leetcodeData, codeforcesData]);

    const { data: currentData, stats: currentStats } = getPlatformData();

    const { weeks, monthLabels } = useMemo(() => processContributions(currentData), [currentData, processContributions]);

    return (
        <section className="flex flex-col gap-4 relative">
            {/* Header: Tabs & Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3">
                <div className="flex flex-wrap gap-1 p-1 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                    {Object.entries(platforms).map(([key, platform]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as 'github' | 'leetcode' | 'codeforces')}
                            aria-pressed={activeTab === key}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all duration-300 ${activeTab === key
                                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                }`}
                        >
                            <span>{platform.icon}</span>
                            <span className="hidden xs:inline sm:inline">{platform.name}</span>
                        </button>
                    ))}
                </div>

            </div>

            {/* Calendar Container - Scrollable on mobile */}
            <div className="relative border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-xl p-4 overflow-x-auto group">
                {/* Month Labels */}
                <div className="relative h-6 mb-1">
                    <svg viewBox={`0 0 ${53 * 13} 15`} className="w-full min-w-[689px] h-full block">
                        {monthLabels.map((m) => (
                            <text
                                key={`${m.weekIndex}-${m.month}`}
                                x={m.weekIndex * 13}
                                y="12"
                                className="text-[10px] font-mono fill-zinc-500 font-medium"
                            >
                                {m.month}
                            </text>
                        ))}
                    </svg>
                </div>

                {/* Heatmap Grid */}
                {isLoading ? (
                    <div className="h-[91px] min-w-[689px] flex items-center justify-center">
                        <div className="flex gap-[3px]">
                            {Array.from({ length: 53 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-[3px]">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <div key={j} className="w-[10px] h-[10px] rounded-[2.5px] bg-zinc-800/60 animate-pulse" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : weeks.length === 0 ? (
                    <div className="h-[100px] flex items-center justify-center text-xs font-mono text-zinc-600">
                        Unable to load data
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <svg viewBox={`0 0 ${53 * 13} ${7 * 13}`} className="w-full min-w-[689px] h-auto block select-none">
                            {weeks.map((week, w) => (
                                <g key={w} transform={`translate(${w * 13}, 0)`}>
                                    {week.days.map((day, d) => (
                                        <rect
                                            key={day.date}
                                            x="0"
                                            y={d * 13}
                                            width="10"
                                            height="10"
                                            fill={levels[day.level]}
                                            rx="2.5"
                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                            onMouseEnter={(e: React.MouseEvent<SVGRectElement>) => {
                                                const rect = (e.target as SVGRectElement).getBoundingClientRect();
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
                            {(currentStats.value ?? '-').toLocaleString()}
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

export default ContributionGraph;
