"use client";
import { useState, useEffect } from "react";
import Search from "./Search";
async function getProducts() {
    const res = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
         query GetProducts {
          products(limit: 30) {
            products {
              id
              title
              description
              category
              price
              discountPercentage
              rating
              stock
              brand
              thumbnail
              images
              reviews {
                rating
                comment
                reviewerName
              }
            }
          }
        }
      `,
        }),
        cache: "no-store",
    });

    const result = await res.json();

    if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error("Failed to fetch products");
    }
    setProducts(result.data.products.products);
}

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function getProducts() {
      const res = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
         query GetProducts {
          products(limit: 30) {
            products {
              id
              title
              description
              category
              price
              discountPercentage
              rating
              stock
              brand
              thumbnail
              images
              reviews {
                rating
                comment
                reviewerName
              }
            }
          }
        }
      `,
        }),
        cache: "no-store",
      });

      const result = await res.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error("Failed to fetch products");
      }
      setProducts(result.data.products.products);
    }
    getProducts();
  }, []);

  useEffect(() => {
      async function onSearch(searchQuery) {
          const res = await fetch("http://localhost:3000/api/graphql", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  query: `
           query GetProducts{
             searchProducts(q:"${searchQuery}"){
                id
              title
              description
              category
              price
              discountPercentage
              rating
              stock
              brand
              thumbnail
              images
              reviews {
                rating
                comment
                reviewerName
             }
           }
        }
        `
              }),
          });
          const data = await res.json();
          if(data.errors){
            console.error("GraphQL Error: ", data.errors);
              throw new Error("Result not found"); 
          }
          setProducts(data.data.searchProducts);
        }
       if(searchQuery)
       {
           onSearch(searchQuery);
       }
       else
        getProducts();
  },[searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <Search onSearch={setSearchQuery}/>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product) => {
            const discountedPrice = (
              product.price *
              (1 - product.discountPercentage / 100)
            ).toFixed(2);
            const reviewCount = product.reviews?.length || 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-700 text-lg leading-tight line-clamp-2 min-h-[3.2rem] mb-2">
                    {product.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4">
                    {product.brand} • {product.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-3xl font-bold text-gray-900">
                      ${discountedPrice}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">★</span>
                      <span className="font-semibold text-gray-700">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({reviewCount})
                      </span>
                    </div>

                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} left`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products?.length === 0 && (
          <p className="text-center text-gray-500 mt-16 text-xl">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
