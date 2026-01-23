import React from 'react';
import { SectionTitle, PatternDivider } from './Home'; // Reusing components
import { Code, Terminal, Monitor, Cpu, Database, Cloud, Layout, Box } from 'lucide-react';

interface ToolItemProps {
    name: string;
    description: string;
    icon: React.ReactNode;
    tag?: string;
}

const ToolItem: React.FC<ToolItemProps> = ({ name, description, icon, tag }) => (
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

const Toolbox: React.FC = () => {
    return (
        <div className="flex flex-col animate-in fade-in duration-500">
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

            {/* Software & SaaS */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="SOFTWARE & SAAS" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="IntelliJ IDEA"
                        description="Pro-grade IDE for Java and heavy-duty development. Robust refactoring and deep code analysis."
                        icon={<Code size={24} />}
                        tag="Editor"
                    />
                    <ToolItem
                        name="Antigravity"
                        description="My primary AI coding assistant. Powerful, agentic, and deeply integrated into my workflow."
                        icon={<Box size={24} />}
                        tag="AI Agent"
                    />
                    <ToolItem
                        name="Claudecode"
                        description="Professional CLI for AI-assisted engineering. Seamless terminal-based code generation."
                        icon={<Terminal size={24} />}
                        tag="CLI Tool"
                    />
                    <ToolItem
                        name="Supabase"
                        description="The open-source Firebase alternative. Handles my authentication and PostgreSQL needs."
                        icon={<Database size={24} />}
                        tag="Backend"
                    />
                    <ToolItem
                        name="Vercel"
                        description="Deployment platform for high-performance frontends. Zero-config CI/CD for my projects."
                        icon={<Cloud size={24} />}
                        tag="Cloud"
                    />
                    <ToolItem
                        name="Gemini"
                        description="Advanced multimodal AI for research, documentation, and brainstorming complex features."
                        icon={<Cpu size={24} />}
                        tag="AI Model"
                    />
                    <ToolItem
                        name="OpenCode"
                        description="Open-source collaboration platform for hackathons and community-driven development."
                        icon={<Layout size={24} />}
                        tag="Platform"
                    />
                </div>
            </section>

            {/* Tech Stack */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="TECH STACK" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="React & Next.js"
                        description="Building interactive, scalable frontends with server-side rendering and static generation."
                        icon={<Layout size={24} />}
                        tag="Frontend"
                    />
                    <ToolItem
                        name="Node.js & Express"
                        description="Fast, event-driven backend services with a massive ecosystem of middleware."
                        icon={<Cpu size={24} />}
                        tag="Backend"
                    />
                    <ToolItem
                        name="PostgreSQL"
                        description="Advanced open-source relational database for complex queries and data integrity."
                        icon={<Database size={24} />}
                        tag="Database"
                    />
                    <ToolItem
                        name="Docker"
                        description="Ensuring environment consistency from local development to production deployment."
                        icon={<Box size={24} />}
                        tag="DevOps"
                    />
                </div>
            </section>

            {/* Computers & Hardware */}
            <section className="flex flex-col gap-6">
                <SectionTitle title="COMPUTERS & HARDWARE" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToolItem
                        name="MacBook Pro M1 Pro"
                        description="Primary powerhouse for development. Insane efficiency, battery life, and Unix-based stability."
                        icon={<Monitor size={24} />}
                        tag="System"
                    />
                    <ToolItem
                        name="HP Laptop (i7 13th Gen)"
                        description="Secondary workstation for Windows-specific tasks, testing, and multi-threaded processing."
                        icon={<Cpu size={24} />}
                        tag="Workstation"
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
