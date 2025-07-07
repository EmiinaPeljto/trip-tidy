import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HorizontalScrollContainer = ({ children, items, title }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      // A small buffer is added to account for sub-pixel rendering issues
      const buffer = 1;
      setCanScrollLeft(el.scrollLeft > buffer);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - buffer);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability);
      // Also check on window resize
      window.addEventListener('resize', checkScrollability);
    }

    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, [items]); // Re-check when items change

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; // Scroll by 80% of the container width
      el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 ">
        {title && <p className="text-gray-600">{title}</p>}
        <div className="flex space-x-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-gray-600 h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-gray-600 h-4 w-4" />
          </button>
        </div>
      </div>
      <div
  ref={scrollRef}
  className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide"
>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;
