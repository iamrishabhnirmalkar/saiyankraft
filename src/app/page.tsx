"use client";

import { Product } from "@/@types";
import { getProductsPaginated } from "@/lib/api/api";
import Productcard from "@/components/custom-ui/Productcard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"; // Adjust path as needed

export default function ProductsPage() {
  const fetchProducts = async (page: number) => {
    const result = await getProductsPaginated(page, 10);
    return result ?? [];
  };

  const {
    items: products,
    loading,
    error,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll<Product>(fetchProducts, 10);

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const isLast = index === products.length - 1;
          const key = `${product.id}-${index}`;

          return (
            <div ref={isLast ? lastElementRef : undefined} key={key}>
              <Productcard product={product} />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="text-center mt-4">Loading more products...</div>
      )}
      {error && <div className="text-center text-red-600 mt-4">{error}</div>}
      {!hasMore && <div className="text-center mt-4">No more products.</div>}
    </main>
  );
}
