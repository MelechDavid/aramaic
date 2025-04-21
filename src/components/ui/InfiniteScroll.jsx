import { useEffect, useRef } from 'react';

const InfiniteScroll = ({ onLoadMore, hasMore, loading, children }) => {
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // If the loading element is visible and we have more items to load
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    // Observe the loading element
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current && loadingRef.current) {
        observerRef.current.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className="w-full">
      {children}
      <div ref={loadingRef} className="h-10 w-full flex items-center justify-center">
        {hasMore && loading && <div className="loader"></div>}
      </div>
    </div>
  );
};

export default InfiniteScroll;