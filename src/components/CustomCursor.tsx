import { useEffect, useState, useCallback, useRef } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const rafId = useRef<number | null>(null);
    const isVisibleRef = useRef(isVisible);

    // Keep ref in sync with state
    useEffect(() => {
        isVisibleRef.current = isVisible;
    }, [isVisible]);

    const updatePosition = useCallback((e: MouseEvent) => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }
        rafId.current = requestAnimationFrame(() => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisibleRef.current) {
                setIsVisible(true);
            }
        });
    }, []);

    useEffect(() => {
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', updatePosition, { passive: true });

        // Add listeners to clickable elements
        const addListeners = () => {
            const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
            clickables.forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        const removeListeners = () => {
            const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
            clickables.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };

        // Initial bind
        addListeners();

        // Re-bind on mutation (simple observer for SPA changes)
        const observer = new MutationObserver(() => {
            removeListeners();
            addListeners();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            removeListeners();
            observer.disconnect();
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [updatePosition]);

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
