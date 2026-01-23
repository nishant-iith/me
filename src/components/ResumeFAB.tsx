import React from 'react';
import { FileText } from 'lucide-react';

const ResumeFAB: React.FC = () => {
    return (
        <div
            className="fixed bottom-8 right-8 z-[100] group flex items-center justify-center bg-zinc-950/80 backdrop-blur-md border border-dashed border-zinc-800 text-zinc-500 transition-all duration-300 rounded-full h-12 w-12 hover:w-64 overflow-hidden shadow-lg cursor-not-allowed"
            aria-label="Resume Under Construction"
        >
            <div className="flex items-center justify-center w-full px-4">
                <FileText size={18} className="shrink-0 text-zinc-600 group-hover:text-amber-500/50 transition-colors" />
                <div className="flex items-center overflow-hidden w-0 group-hover:w-auto transition-all duration-500">
                    <span className="font-mono text-[10px] font-bold whitespace-nowrap pl-3 tracking-tighter text-zinc-500 uppercase">
                        LOG:// [RESUME_UPLOADING...]
                    </span>
                </div>
            </div>
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

export default ResumeFAB;
