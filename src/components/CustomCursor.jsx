import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', updatePosition);

        // Add listeners to clickable elements
        const updateListeners = () => {
            const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
            clickables.forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
            return () => {
                clickables.forEach((el) => {
                    el.removeEventListener('mouseenter', handleMouseEnter);
                    el.removeEventListener('mouseleave', handleMouseLeave);
                });
            };
        };

        // Initial bind
        let cleanup = updateListeners();

        // Re-bind on mutation (simple observer for SPA changes)
        const observer = new MutationObserver(updateListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            cleanup();
            if (cleanup) cleanup();
            observer.disconnect();
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-100 ease-out mix-blend-exclusion bg-white"
            style={{
                left: position.x,
                top: position.y,
                width: isHovering ? '32px' : '12px',
                height: isHovering ? '32px' : '12px',
                transform: 'translate(-50%, -50%)',
                opacity: isHovering ? 0.8 : 0.5
            }}
        />
    );
};

export default CustomCursor;
