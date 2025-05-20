"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/api/products";
import { Product } from "@/@types";
import Productcard from "@/components/custom-ui/Productcard";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllProducts();
      setProducts(result);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <Productcard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
