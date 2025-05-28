// pages/product/[id].tsx (or app/product/[id]/page.tsx if app router)

import React from "react";
// Make sure getProductById is exported from "@/lib/api/api"
// If getProductById is not exported, replace with the correct function or fix the export in "@/lib/api/api"
import Image from "next/image";
import { Product } from "@/@types";
import { getSingleProductData } from "@/lib/api/api";
import { useRouter } from "next/router";

export default function ProductDetailPage() {
  const router = useRouters();
  const { id } = router.query;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!id) return;

    setLoading(true);
    getSingleProductData(Number(id))
      .then((data: Product | null) => {
        if (!data) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(data);
          setError("");
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally((): void => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex gap-6">
        <div className="w-1/2 relative h-96 rounded-xl overflow-hidden">
          <Image
            src={product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="w-1/2">
          <p className="mb-4">
            {product.description || "No description available."}
          </p>
          <div className="text-xl font-semibold mb-4">
            Price: ₹
            {product.sale_price && +product.sale_price > 0
              ? product.sale_price
              : product.price}
          </div>
          {/* You can add Add to Cart / Wishlist buttons here like in Productcard */}
        </div>
      </div>
    </main>
  );
}
function useRouters() {
  return useRouter();
}
