"use client";
import { useState, useEffect } from "react";
import Search from "./Search";
import Categories from "./Categories";
import Link from "next/link";


const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setactiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
          setLoading(false);
          setProducts(data.data.searchProducts);
        }
       if(searchQuery)
       {
         setLoading(true);          
           onSearch(searchQuery);
       }
       else
      {
         setLoading(true);
         getProducts();
      }
  },[searchQuery])

  useEffect(()=>{
    setLoading(true);
     if(activeCategory!=="All")
      getCategory(activeCategory);
     else 
      getProducts();
  },[activeCategory])

  async function getProducts() {
        const res = await fetch("http://localhost:3000/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
         query  {
          categories
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
        setLoading(false);
        setProducts(result.data.products.products);
        setCategories(["All",...result.data.categories]);
  }

  async function getCategory(category){
      console.log("productsByCategory: ", category)
    const res = await fetch("http://localhost:3000/api/graphql",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
             query getPostsByCategories{
                productsByCategory(category: "${category}") {
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
            `,
        }),
      cache: 'no-cache'
    });

    const data = await res.json();

    if(data.errors){
        console.error("GraphQL Error: ", data.errors);
        throw new Error("could not found category");
    }

      setLoading(false);
      setProducts(data.data.productsByCategory);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl h-full mx-auto px-6">
              <div className="flex flex-row gap-6 justify-between mb-10">
                  <Search onSearch={setSearchQuery} />
                  {categories && (
                      <Categories categories={categories} activeCategory={activeCategory} setActiveCategory={(value)=>{
                        setactiveCategory(value);
                      }} />
                  )}
              </div>
        {/* Product Grid */}
        {loading && (<div className="h-[calc(100vh-300px)] flex justify-center items-center">
          <p className="text-3xl text-gray-700 font-semibold">Loading....</p>
        </div>)}
       {
        products && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products?.map((product) => {
                const discountedPrice = (
                  product.price *
                  (1 - product.discountPercentage / 100)
                ).toFixed(2);
                const reviewCount = product.reviews?.length || 0;

                return (
                  <Link
                    href={`/products/${product.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 block"
                  >
                 
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {product.discountPercentage > 0 && (
                        <div className="absolute top-4 right-4 bg-red-100 text-red-400 text-xs font-bold px-3 py-1 rounded-full shadow">
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
                          className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 10
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
                  </Link>
                );
              })}
            </div>
        )
       }

        {loading !==true && products?.length === 0 && (
          <p className="text-center text-gray-500 mt-16 text-xl">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
