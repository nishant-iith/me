import React from 'react';
import { SectionTitle, PatternDivider } from './Home'; // Reusing components
import { Code, Terminal, Monitor, Cpu, Database, Cloud, PenTool, Layout, Box } from 'lucide-react';

const ToolItem = ({ name, description, icon, tag }) => (
    <div className="group relative border border-zinc-800 bg-zinc-900/40 p-5 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-100 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            {tag && (
                <span className="text-[10px] font-mono border border-zinc-800 bg-zinc-950/50 px-2 py-1 rounded text-zinc-500 uppercase">
                    {tag}
                </span>
            )}
        </div>
        <h3 className="font-doto text-lg text-zinc-100 mb-1">{name}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

const Toolbox = () => {
    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2 pt-4">
                <h1 className="font-doto text-4xl font-bold tracking-tight text-zinc-100 uppercase">
                    MY TOOLBOX
                </h1>
                <p className="text-zinc-500 font-mono text-sm max-w-md">
                    The software and hardware that powers my daily workflow.
                    "Use what you know, but know what you use."
                </p>
            </div>

            <PatternDivider />

            {/* Software / Editor */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="EDITOR & TERMINAL" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="VS Code"
                        description="My daily driver. Lightweight, extensible, and fast. Configured with Tokyo Night theme and Fira Code."
                        icon={<Code size={24} />}
                        tag="Editor"
                    />
                    <ToolItem
                        name="Windows Terminal"
                        description="Modern, fast, and efficient terminal. Zsh + Oh My Posh for the prompt aesthetics."
                        icon={<Terminal size={24} />}
                        tag="Terminal"
                    />
                    <ToolItem
                        name="Obsidian"
                        description="My second brain. Markdown-based note-taking for everything from daily logs to system design."
                        icon={<PenTool size={24} />}
                        tag="Productivity"
                    />
                    <ToolItem
                        name="Postman"
                        description="Essential for API development and testing. I use it to mock, test, and document endpoints."
                        icon={<Cloud size={24} />}
                        tag="DevOps"
                    />
                </div>
            </section>

            {/* Stack */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="TECH STACK" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="React & Next.js"
                        description="For building interactive, scalable frontends. I love the component model and ecosystem."
                        icon={<Layout size={24} />}
                        tag="Frontend"
                    />
                    <ToolItem
                        name="Node.js & Express"
                        description="My go-to for backend services. Fast event loop and massive package ecosystem."
                        icon={<Cpu size={24} />}
                        tag="Backend"
                    />
                    <ToolItem
                        name="MongoDB"
                        description="Flexible schema design for rapid prototyping and scalable data storage."
                        icon={<Database size={24} />}
                        tag="Database"
                    />
                    <ToolItem
                        name="Docker"
                        description="Containerization for consistent environments across dev, staging, and prod."
                        icon={<Box size={24} />}
                        tag="DevOps"
                    />
                </div>
            </section>

            {/* Hardware */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="HARDWARE" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="Asus ROG Zephyrus"
                        description="Primary machine. Ryzen 9, RTX 3060. Handles compilation and local LLMs easily."
                        icon={<Monitor size={24} />}
                        tag="Laptop"
                    />
                    <ToolItem
                        name="Logitech MX Master 3S"
                        description="The best mouse for productivity. Infinite scroll is a lifesaver for long docs."
                        icon={<Cpu size={24} />}
                        tag="Peripheral"
                    />
                </div>
            </section>

            <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
                // More tools added as I learn them
            </div>
        </div>
    );
};

export default Toolbox;
