import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  threshold = 0.15
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`scroll-card-item w-full transition-all duration-1000 ease-smooth-out ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0 filter-none'
          : 'opacity-0 scale-[0.88] translate-y-12 filter blur-[1px] will-change-[transform,opacity]'
      } ${className}`}
    >
      {children}
    </div>
  );
}
