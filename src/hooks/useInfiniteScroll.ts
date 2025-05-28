import { useState, useEffect, useRef, useCallback } from "react";

type FetchFunction<T> = (page: number) => Promise<T[]>;

export function useInfiniteScroll<T>(
  fetchData: FetchFunction<T>,
  itemsPerPage = 10
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchData(page)
      .then((newItems) => {
        setItems((prev) => [...prev, ...newItems]);
        if (newItems.length < itemsPerPage) {
          setHasMore(false);
        }
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, [page, fetchData, itemsPerPage]);

  return { items, loading, error, hasMore, lastElementRef };
}
