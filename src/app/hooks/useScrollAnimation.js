import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isVisible]
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once animated, stop observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
}

/**
 * Custom hook for multiple elements scroll animation
 * @param {number} count - Number of elements to track
 * @param {Object} options - Intersection Observer options
 * @returns {Array} Array of [ref, isVisible] pairs
 */
export function useMultipleScrollAnimation(count, options = {}) {
  const refs = useRef([]);
  const [visibleStates, setVisibleStates] = useState(Array(count).fill(false));

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleStates((prev) => {
              const newStates = [...prev];
              newStates[index] = true;
              return newStates;
            });
            observer.unobserve(ref);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
          ...options,
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && refs.current[index]) {
          observer.unobserve(refs.current[index]);
        }
      });
    };
  }, [count, options]);

  const setRef = (index) => (el) => {
    refs.current[index] = el;
  };

  return [setRef, visibleStates];
}

export default useScrollAnimation;
