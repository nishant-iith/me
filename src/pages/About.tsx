import { Link } from 'react-router-dom';
import { Mail, Twitter, Calendar, Terminal } from 'lucide-react';
import me from '../assets/me.jpg';
import { PatternDivider } from '~components/SharedLayout';

export default function About() {
    return (
        <section id="about" className="mb-20 space-y-8 animate-in fade-in duration-500">

            {/* 1. TOP SECTION: IDENTITY */}
            <div className="flex flex-col md:flex-row gap-12 items-center">

                {/* IMAGE FRAME */}
                <div className="relative shrink-0 group/frame">
                    {/* Corner Markers (outside frame) */}
                    <div className="absolute -inset-3 transition-all duration-500 group-hover/frame:scale-105">
                        <div className="absolute h-2 w-2 border-zinc-600 opacity-40 transition-opacity top-0 left-0 border-t border-l group-hover/frame:border-zinc-400"></div>
                        <div className="absolute h-2 w-2 border-zinc-600 opacity-40 transition-opacity top-0 right-0 border-t border-r group-hover/frame:border-zinc-400"></div>
                        <div className="absolute h-2 w-2 border-zinc-600 opacity-40 transition-opacity bottom-0 left-0 border-b border-l group-hover/frame:border-zinc-400"></div>
                        <div className="absolute h-2 w-2 border-zinc-600 opacity-40 transition-opacity bottom-0 right-0 border-b border-r group-hover/frame:border-zinc-400"></div>
                    </div>

                    {/* Image */}
                    <div className="relative size-[180px] overflow-hidden transition-all duration-700 border border-zinc-900 group-hover/frame:border-zinc-800">
                        <img
                            src={me}
                            alt="Nishant Verma"
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover/frame:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    {/* Label below image */}
                    <div className="absolute -bottom-8 left-0 w-full text-center">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] group-hover/frame:text-zinc-400 transition-colors">
                            Fig.01 // Identity
                        </span>
                    </div>
                </div>

                {/* INFO PANEL */}
                <div className="flex-1 w-full">
                    <div className="group/panel relative border border-zinc-900 border-dashed bg-black/10 overflow-hidden transition-all hover:border-zinc-800">
                        {/* Corner Markers */}
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600 transition-colors group-hover/panel:border-zinc-400"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600 transition-colors group-hover/panel:border-zinc-400"></div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-900 bg-zinc-900/30">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-0.5 bg-zinc-700"></div>
                                <div className="w-1.5 h-0.5 bg-zinc-700"></div>
                                <div className="w-1.5 h-0.5 bg-zinc-800"></div>
                            </div>
                        </div>

                        {/* Data Rows */}
                        <div className="flex flex-col">
                            <InfoRow index="00" label="Name" value="Nishant Verma" />
                            <InfoRow index="01" label="Age" value="23" />
                            <InfoRow index="02" label="Location" value="Hyderabad, IN" />
                            <InfoRow index="03" label="Role" value="Software Engineer" />
                            <InfoRow index="04" label="Status" value="Open to Work" isStatus />
                        </div>

                        {/* Grid Pattern Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
                    </div>
                </div>
            </div>


            {/* 2. BIO & CONTACT SECTION */}
            <div className="flex flex-col gap-6 w-full max-w-2xl mt-16">

                {/* Bio Panel */}
                <div className="group relative border border-zinc-900 border-dashed bg-black/10 p-6 transition-all hover:border-zinc-800 overflow-hidden">
                    {/* Corner Markers */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600 transition-colors group-hover:border-zinc-400"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600 transition-colors group-hover:border-zinc-400"></div>

                    {/* Decorative dashes */}
                    <div className="absolute top-3 right-3 flex flex-col gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
                        <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400 transition-colors"></div>
                        <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400 transition-colors"></div>
                        <div className="w-1.5 h-0.5 bg-zinc-800"></div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl font-mono font-medium text-zinc-400 tracking-tight flex items-center gap-3 transition-colors">
                        <span className="w-2 h-2 bg-zinc-600 animate-pulse transition-colors"></span>
                        I love what I do.
                    </h2>

                    {/* Bio Text */}
                    <p className="text-zinc-500 font-mono text-sm leading-relaxed mt-4 pl-5 border-zinc-800 group-hover:border-zinc-700 transition-colors">
                        Simple as that. I enjoy building things that look good and work even better. Currently at IIT Hyderabad, love to explore new things and build cool stuff. If you vibe with my work or just want to chat about tech, I'm always open.
                    </p>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Quick Reach Out + Nav Links */}
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Quick reach out</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Left: Contact buttons */}
                        <div className="flex flex-wrap gap-2">
                            <a href="mailto:nishant.iith@gmail.com" aria-label="Send email to Nishant" className="group relative flex items-center gap-2 px-3 py-1.5 border-zinc-800 bg-black/10 hover:bg-white/[0.03] hover:border-zinc-600 transition-all overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <Mail size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">Email</span>
                            </a>
                            <a href="https://twitter.com/nishant_iith" target="_blank" rel="noopener noreferrer" aria-label="Open Twitter profile" className="group relative flex items-center gap-2 px-3 py-1.5 border-zinc-800 bg-black/10 hover:bg-white/[0.03] hover:border-zinc-600 transition-all overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <Twitter size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">DM me</span>
                            </a>
                        </div>

                        {/* Right: Nav buttons */}
                        <div className="flex flex-wrap gap-2">
                            <Link
                                to="/toolbox"
                                className="group relative flex items-center gap-2 px-3 py-1.5 border-zinc-800 bg-black/10 hover:bg-white/[0.03] hover:border-zinc-600 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <Terminal size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">Toolbox</span>
                            </Link>
                            <Link
                                to="/timeline"
                                className="group relative flex items-center gap-2 px-3 py-1.5 border-zinc-800 bg-black/10 hover:bg-white/[0.03] hover:border-zinc-600 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-white/50 transition-all"></div>
                                <Calendar size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors">Timeline</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-0">
                    <Link
                        to="/timeline"
                        className="relative block p-3 border border-zinc-900 bg-black/10 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600 transition-colors group-hover:border-white"></div>
                        </div>
                        <div className="flex flex-col h-full justify-between gap-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">[ 01 ]</span>
                                <Calendar size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <span className="font-mono text-base text-zinc-300 group-hover:text-white transition-colors block">Timeline</span>
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400">My journey through projects, milestones, and achievements</span>
                            </div>
                        </div>
                    </Link>
                    <Link
                        to="/toolbox"
                        className="relative block p-3 border border-zinc-900 bg-black/10 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600 transition-colors group-hover:border-white"></div>
                        </div>
                        <div className="flex flex-col h-full justify-between gap-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">[ 02 ]</span>
                                <Terminal size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <span className="font-mono text-base text-zinc-300 group-hover:text-white transition-colors block">My Toolbox</span>
                                <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400">The software and hardware I use daily</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>


            {/* HORIZONTAL DIVIDER */}
            <PatternDivider />


            {/* HOBBIES & INTERESTS SECTION */}
            <div className="max-w-2xl mt-8 border border-zinc-900 border-dashed bg-black/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-dashed border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-0.5 bg-zinc-700"></div>
                            <div className="w-1.5 h-0.5 bg-zinc-700"></div>
                            <div className="w-1.5 h-0.5 bg-zinc-800"></div>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">Hobbies & Interests</span>
                    </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-zinc-900/50">
                    <HobbyItem index="01" title="Competitive Programming" desc="Solving algorithmic challenges on Codeforces and LeetCode." />
                    <HobbyItem index="02" title="Open Source" desc="Contributing to tools and frameworks that power the web." />
                    <HobbyItem index="03" title="System Design" desc="Designing scalable architectures and distributed systems." />
                    <HobbyItem index="04" title="Reading Tech Blogs" desc="Staying updated with the latest in software engineering." />
                </div>
            </div>

        </section >
    );
}

/* --- COMPONENTS --- */

interface InfoRowProps {
    index: string;
    label: string;
    value: string;
    isStatus?: boolean;
}

function InfoRow({ index, label, value, isStatus }: InfoRowProps) {
    return (
        <div className={`group flex items-center py-2.5 px-3 ${isStatus ? '' : 'border-b border-zinc-900/50'} hover:bg-white/[0.02] transition-colors relative`}>
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Index */}
            <span className="font-mono text-[8px] text-zinc-700 group-hover:text-zinc-500 mr-3 transition-colors">{index}</span>

            {/* Label */}
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest min-w-[70px] shrink-0 group-hover:text-zinc-400 transition-colors">{label}</span>

            {/* Dotted separator */}
            <div className="h-px flex-1 bg-zinc-900 group-hover:bg-zinc-800 transition-colors mx-3"></div>

            {/* Value */}
            {isStatus ? (
                <span className="font-mono text-sm text-zinc-400 group-hover:text-white flex items-center gap-2 transition-colors">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-400"></span>
                    </span>
                    {value}
                </span>
            ) : (
                <span className="font-mono text-sm text-zinc-400 group-hover:text-white transition-colors">{value}</span>
            )}
        </div>
    );
}

interface HobbyItemProps {
    index: string;
    title: string;
    desc: string;
}

function HobbyItem({ index, title, desc }: HobbyItemProps) {
    return (
        <div className="group px-4 py-3 hover:bg-white/[0.02] transition-colors relative">
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start gap-4">
                <span className="font-mono text-[9px] text-zinc-700 mt-0.5 shrink-0">{index}</span>
                <div className="flex-1">
                    <h4 className="font-mono text-sm text-zinc-400 group-hover:text-white transition-colors">{title}</h4>
                    <p className="font-mono text-[11px] text-zinc-600 group-hover:text-zinc-500 mt-0.5 leading-relaxed transition-colors">{desc}</p>
                </div>
            </div>
        </div>
    );
}
