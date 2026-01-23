import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LOG_LINES: string[] = [
    "Initializing system diagnostics...",
    "Loading kernel modules: [vfs, net, sys]... OK",
    "Checking memory integrity... 0x0000 -> 0xFFFF... OK",
    "Mounting file system... OK",
    "Resolving host... localhost",
    "Verifying request path... /random-page",
    "Searching route table...",
    "WARN: Route match failed (E_NO_ROUTE)",
    "Attempting fallback resolution...",
    "ERROR: 404_PAGE_NOT_FOUND exception at 0x8F4A2",
    "CRITICAL: Navigation subsystem failure",
    "Stack trace:",
    "  at Router.resolve (router.js:42)",
    "  at BrowserHistory.push (history.js:128)",
    "  at User.click (input.js:9)",
    "Dumping core to /dev/null...",
    "System halted. Reboot required."
];

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const [lines, setLines] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < LOG_LINES.length) {
                const nextLine = LOG_LINES[currentIndex];
                setLines(prev => [...prev, nextLine]);
                currentIndex++;
            } else {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    const isError = (text: string): boolean => {
        if (!text) return false;
        return text.includes("ERROR") || text.includes("CRITICAL") || text.includes("WARN") || text.includes("Stack trace");
    };

    return (
        <div className="min-h-screen bg-[#050505] text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Glitch / scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen"></div>
            <div className="absolute inset-0 pointer-events-none z-10 bg-[length:100%_4px] bg-repeat-y opacity-10" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)' }}></div>

            <div className="max-w-2xl w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden relative z-20 animate-in zoom-in-95 duration-500">

                {/* Terminal Header */}
                <div className="h-9 bg-[#18181b] border-b border-zinc-800 flex items-center px-4 gap-2 select-none">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Terminal size={12} />
                        <span>root@portfolio:~/diagnostics</span>
                    </div>
                </div>

                {/* Terminal Content */}
                <div className="p-6 min-h-[350px] flex flex-col font-mono text-xs md:text-sm">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[400px] mb-8 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent font-fira-code">
                        {lines.map((line, index) => (
                            <div key={index} className={`mb-1 break-words ${isError(line) ? (line.includes("WARN") ? 'text-yellow-500' : 'text-red-400') : 'text-zinc-400'}`}>
                                <span className="opacity-30 mr-3 select-none">
                                    {new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                </span>
                                {line.includes("ERROR") || line.includes("CRITICAL") ? (
                                    <span className="bg-red-500/10 px-1 rounded-sm text-red-400 font-bold">{line}</span>
                                ) : (
                                    <span>{line}</span>
                                )}
                            </div>
                        ))}
                        {isComplete && (
                            <div className="animate-pulse text-zinc-500 mt-2">
                                <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="w-2 h-4 bg-zinc-500 inline-block align-middle"></span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 ${isComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] shadow-xl shadow-white/5"
                        >
                            <Power size={18} />
                            <span>System Reboot</span>
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 py-3 rounded flex items-center justify-center gap-2 border border-zinc-800 transition-all hover:border-zinc-700"
                        >
                            <RefreshCw size={18} />
                            <span>Retry Connection</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer Error Code */}
            <div className="mt-12 text-center opacity-20 pointer-events-none select-none">
                <h1 className="text-[8rem] leading-none font-bold text-zinc-800 font-doto">
                    404
                </h1>
                <p className="text-zinc-700 font-mono tracking-[0.5em] text-sm uppercase mt-4">Page Not Found</p>
            </div>

        </div>
    );
};

export default NotFound;
