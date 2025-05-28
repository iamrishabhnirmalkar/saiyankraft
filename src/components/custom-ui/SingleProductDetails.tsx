"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/@types/index";
import { getSingleProductData } from "@/lib/api/api";

interface SingleProductDetailsProps {
  productId: number;
}

export default function SingleProductDetails({
  productId,
}: SingleProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      const data = await getSingleProductData(productId);
      if (data) {
        setProduct(data);
      } else {
        setError("Failed to load product data.");
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* Product Images */}
      <div className="mb-6">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            className="w-full max-h-96 object-contain rounded"
          />
        ) : (
          <p>No images available.</p>
        )}
      </div>

      {/* Product Price */}
      <p className="text-xl font-semibold mb-4">Price: ₹{product.price}</p>

      {/* Product Description (may contain HTML) */}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />

      {/* Product Additional Info */}
      <div className="mt-6">
        <p>
          <strong>SKU:</strong> {product.sku || "N/A"}
        </p>
        <p>
          <strong>Stock Status:</strong> {product.stock_status}
        </p>
        <p>
          <strong>Weight:</strong>{" "}
          {product.weight ? `${product.weight} kg` : "N/A"}
        </p>
        <p>
          <strong>Categories:</strong>{" "}
          {product.categories && product.categories.length > 0
            ? product.categories.map((cat) => cat.name).join(", ")
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
