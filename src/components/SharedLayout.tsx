interface SectionTitleProps {
    title: string;
}

export const SectionTitle = ({ title }: SectionTitleProps) => (
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
