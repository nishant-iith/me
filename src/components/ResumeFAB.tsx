import React from 'react';
import { FileText, Download } from 'lucide-react';

const ResumeFAB: React.FC = () => {
    return (
        <a
            href="/Nishant_IITH.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] group flex items-center justify-center bg-zinc-900/80 backdrop-blur-md border border-dashed border-zinc-600 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-400 transition-all duration-300 rounded-full h-12 w-12 hover:w-36 overflow-hidden shadow-lg"
            aria-label="Download Resume"
        >
            <div className="flex items-center justify-center w-full">
                <FileText size={18} className="shrink-0 text-zinc-300 group-hover:text-white transition-colors" />
                <div className="flex items-center overflow-hidden w-0 group-hover:w-auto transition-all duration-300">
                    <span className="font-mono text-xs font-bold whitespace-nowrap pl-2 text-zinc-200">
                        RESUME
                    </span>
                    <Download size={14} className="ml-2 shrink-0 text-zinc-400 group-hover:text-white" />
                </div>
            </div>
        </a>
    );
};

export default ResumeFAB;
