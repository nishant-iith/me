import React from 'react';
import { House, User, Sparkles, BookOpen, NotebookPen, Code2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="fixed left-4 lg:left-9 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-6 p-2 rounded-2xl border border-dashed border-zinc-800 bg-black/20 backdrop-blur-md">

            {/* Logo */}
            <div className="w-10 h-10 bg-zinc-900/80 border border-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg group hover:border-zinc-500 transition-colors cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-100 group-hover:text-blue-400 transition-colors">
                    <path d="M12 14v12" />
                    <path d="M12 20a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v6" />
                </svg>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-4">
                <NavItem to="/" icon={<House size={20} />} label="Home" />
                <NavItem to="/about" icon={<User size={20} />} label="About" />
                <NavItem to="/skill" icon={<Sparkles size={20} />} label="Skills" />
                <NavItem to="/blog" icon={<NotebookPen size={20} />} label="Blog" />
                <NavItem to="/books" icon={<BookOpen size={20} />} label="Books" />
                <NavItem to="/snippets" icon={<Code2 size={20} />} label="Snippets" />
            </div>
        </aside>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
            relative flex items-center justify-center w-10 h-10 rounded-sm transition-all duration-300 group
            ${isActive
                ? 'bg-zinc-800 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
        `}
        title={label}
    >
        {({ isActive }) => (
            <>
                {icon}
                {/* Corner Accents - The "Cool" Factor */}
                <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l transition-all duration-300 ${isActive ? 'border-zinc-500' : 'border-transparent group-hover:border-zinc-700'}`} />
                <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r transition-all duration-300 ${isActive ? 'border-zinc-500' : 'border-transparent group-hover:border-zinc-700'}`} />
                <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l transition-all duration-300 ${isActive ? 'border-zinc-500' : 'border-transparent group-hover:border-zinc-700'}`} />
                <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r transition-all duration-300 ${isActive ? 'border-zinc-500' : 'border-transparent group-hover:border-zinc-700'}`} />
            </>
        )}
    </NavLink>
);

export default Sidebar;
