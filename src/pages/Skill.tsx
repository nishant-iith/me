import { PatternDivider } from './Home';

// Skills data organized by category
const skillCategories = [
    {
        title: "CORE LANGUAGES",
        skills: [
            { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
            { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
            { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        ]
    },
    {
        title: "FRONTEND STACK",
        skills: [
            { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
            { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        ]
    },
    {
        title: "BACKEND STACK",
        skills: [
            { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
            { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
        ]
    },
    {
        title: "DATABASE & ACCESS",
        skills: [
            { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        ]
    },
    {
        title: "INFRA & TOOLS",
        skills: [
            { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
            { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
            { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
            { name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
        ]
    }
];

const Skill: React.FC = () => {
    return (
        <div className="relative z-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="px-0 pb-4 space-y-4">
                <h1 className="text-3xl font-mono font-medium text-white tracking-tight">Tools of the Trade</h1>
                <p className="text-zinc-400 font-mono text-[10px] leading-relaxed border-dashed border-l border-zinc-800 pl-4 py-1 sm:py-2 bg-black/10">
                    <span className="text-zinc-300 mr-2 font-medium underline">INFO</span>:
                    A list of tech I use to build stuff.
                </p>
            </div>

            {/* Categories */}
            {skillCategories.map((category) => (
                <div key={category.title}>
                    <PatternDivider />
                    <section className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-1.5 bg-zinc-600"></div>
                            <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-300">
                                {category.title}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {category.skills.map((skill: { name: string; icon: string }) => (
                                <SkillCard key={skill.name} name={skill.name} icon={skill.icon} />
                            ))}
                        </div>
                    </section>
                </div>
            ))}
            <PatternDivider />
        </div>
    );
};

interface SkillCardProps {
    name: string;
    icon: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ name, icon }) => (
    <div className="group relative flex flex-col items-center justify-center p-2 border border-zinc-900 border-dashed bg-black/10 transition-all hover:bg-white/[0.02] hover:border-zinc-800 aspect-square overflow-hidden">
        {/* Corner markers */}
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-600 opacity-50 group-hover:opacity-100 transition-all"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-zinc-600 opacity-50 group-hover:opacity-100 transition-all"></div>

        {/* Decorative dashes */}
        <div className="absolute top-2 right-2 flex flex-col gap-0.5 opacity-40">
            <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400"></div>
            <div className="w-1.5 h-0.5 bg-zinc-600 group-hover:bg-zinc-400"></div>
            <div className="w-1.5 h-0.5 bg-zinc-800"></div>
        </div>

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center size-8 mb-4 group-hover:scale-110 transition-all duration-300 filter grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100">
            <img src={icon} alt={name} className="size-full" />
        </div>

        {/* Label */}
        <div className="relative z-10 flex flex-col items-center gap-1 px-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400 group-hover:text-white transition-colors font-semibold text-center leading-tight">
                {name}
            </span>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
    </div>
);

export default Skill;
