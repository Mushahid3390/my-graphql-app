"use client"
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";



import Image from "next/image";
const page = () => {
    const router = useRouter();
    const params = useParams();
    const [loading , setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [selectedImage, setSelectedImage] = useState(0);
    
    useEffect(()=>{
       getProduct(params.id)
    },[params.id]);

    async function getProduct(id){
        console.log("id: ", id)
        try{
            const res = await fetch("http://localhost:3000/api/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                  query getProduct{
                     product(id: ${id}){
                       id
                       title
                       description
                       category
                       price
                       discountPercentage
                       rating
                       stock
                       brand
                       sku
                       weight
                       dimensions {
                         width
                         height
                         depth
                       }
                       warrantyInformation
                       shippingInformation
                       availabilityStatus
                       reviews {
                         rating
                         comment
                         date
                         reviewerName
                         reviewerEmail
                       }
                       returnPolicy
                       minimumOrderQuantity
                       images
                       thumbnail
                       meta {
                         createdAt
                         updatedAt
                         barcode
                         qrCode
                       }
                     }
                  } 
                `,
                    variables: { id }
                }),
                cache: 'no-cache'
            });

            const data = await res.json();
            console.log(data.data.product)
            setLoading(false);
            setProduct(data.data.product)


            if (data.data.product.images > 0)
                setSelectedImage(0)
        }
        catch(errors){
            console.log("GraphQL Errors: ", errors);
            setLoading(false);
            throw new Error("Product not found");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-6 text-xl text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-blue-700 transition-colors"
                    ><FaArrowLeft /> Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const discountedPrice = (product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2);
    const reviewCount = product.reviews?.length || 0;
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    ← Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src={product.images?.[selectedImage] || product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-contain p-8"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-blue-500 shadow-md'
                                                : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                <span className="uppercase text-[20px] tracking-widest">{product.brand}</span>
                                <span className="text-gray-400"><GoDotFill /></span>
                                <span className="capitalize leading-.8 text-[20px]">{product.category}</span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-3xl">
                                    <span><FaStar className="size-6 text-green-700" /></span> <span className="font-semibold pt-0.5 text-2xl text-gray-500 ml-1">{product.rating?.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-500">({reviewCount} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold text-gray-900">
                                ${discountedPrice}
                            </span>
                            {product.discountPercentage > 0 && (
                                <div className="text-2xl text-gray-400 line-through">
                                    ${product.price}
                                </div>
                            )}
                            {product.discountPercentage > 0 && (
                                <div className="bg-green-100 text-green-700 text-sm font-bold px-4 py-1 rounded-full">
                                    Save {product.discountPercentage}%
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-medium ${product.stock > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-gray-700 text-xl mb-4">Description</h3>
                            <p className="text-gray-500 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Key Details */}
                        <div className="grid grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow-sm">
                            {product.shippingInformation && (
                                <div>
                                    <p className="text-gray-700 text-[20px]">Shipping</p>
                                    <p className="font-medium text-[16px] text-gray-500">{product.shippingInformation}</p>
                                </div>
                            )}
                            {product.warrantyInformation && (
                                <div>
                                    <p className="text-gray-700 text-[20px]">Warranty</p>
                                    <p className="font-medium text-[16px] text-gray-500">{product.warrantyInformation}</p>
                                </div>
                            )}
                            {product.returnPolicy && (
                                <div>
                                    <p className="text-gray-700 text-[20px]">Return Policy</p>
                                    <p className="font-medium text-[16px] text-gray-500">{product.returnPolicy}</p>
                                </div>
                            )}
                            {product.minimumOrderQuantity && (
                                <div>
                                    <p className="text-gray-700 text-[20px]">Min Order</p>
                                    <p className="font-medium text-[16px] text-gray-500">{product.minimumOrderQuantity} units</p>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl py-6 rounded-3xl transition-all active:scale-95 shadow-lg"
                            onClick={() => alert(`Added ${product.title} to cart!`)}
                        >
                            Add to Cart - ${discountedPrice}
                        </button>

                        {/* Reviews Section */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div className="pt-8 border-t">
                                <h3 className="font-semibold text-gray-900 text-2xl mb-6">Customer Reviews ({reviewCount})</h3>
                                <div className="space-y-8">
                                    {product.reviews.map((review, index) => (
                                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-medium text-gray-700">{review.reviewerName}</p>
                                                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex text-yellow-500">
                                                    {'★'.repeat(Math.floor(review.rating))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page
