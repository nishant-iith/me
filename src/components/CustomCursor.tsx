import { useEffect, useState, useCallback, useRef } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const rafId = useRef<number | null>(null);
    const boundElementsRef = useRef<Set<Element>>(new Set());
    const observerRef = useRef<MutationObserver | null>(null);

    const updatePosition = useCallback((e: MouseEvent) => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }
        rafId.current = requestAnimationFrame(() => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovering(true), []);
    const handleMouseLeave = useCallback(() => setIsHovering(false), []);

    const bindElement = useCallback((el: Element) => {
        if (!boundElementsRef.current.has(el)) {
            boundElementsRef.current.add(el);
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        }
    }, [handleMouseEnter, handleMouseLeave]);

    const unbindElement = useCallback((el: Element) => {
        if (boundElementsRef.current.has(el)) {
            boundElementsRef.current.delete(el);
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
        }
    }, [handleMouseEnter, handleMouseLeave]);

    useEffect(() => {
        window.addEventListener('mousemove', updatePosition, { passive: true });

        const bindAllClickables = () => {
            const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
            clickables.forEach(bindElement);
        };

        const unbindAll = () => {
            boundElementsRef.current.forEach(unbindElement);
            boundElementsRef.current.clear();
        };

        bindAllClickables();

        let debounceTimer: ReturnType<typeof setTimeout>;
        observerRef.current = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                unbindAll();
                bindAllClickables();
            }, 100);
        });
        observerRef.current.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            unbindAll();
            observerRef.current?.disconnect();
            clearTimeout(debounceTimer);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [updatePosition, bindElement, unbindElement]);

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
