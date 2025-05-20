import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 0.1,
}: UseInfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Observer triggered: Loading more items...");
        onLoadMore();
      }
    },
    [onLoadMore, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold });
    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver, threshold]);

  return { observerTarget };
}
