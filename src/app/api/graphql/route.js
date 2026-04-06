import { createYoga, createSchema } from "graphql-yoga";

async function fetchFromDummyJSON(endpoint){
  const res = await fetch(`https://dummyjson.com${endpoint}`, {
    cache: 'no-store'
  })
  if(!res.ok) throw new Error('Failed to fetch')
    return res.json();
}

const schema = createSchema({
    typeDefs: `
    type Dimensions {
      width: Float!
      height: Float!
      depth: Float!
    }

    type Review {
      rating: Float!
      comment: String!
      date: String!
      reviewerName: String!
      reviewerEmail: String!
    }

    type Meta {
      createdAt: String!
      updatedAt: String!
      barcode: String!
      qrCode: String!
    }

    type Product {
      id: ID!
      title: String!
      description: String!
      category: String!
      price: Float!
      discountPercentage: Float!
      rating: Float!
      stock: Int!                  # ← Fixed: was probably "int"
      tags: [String!]!
      brand: String
      sku: String
      weight: Float
      dimensions: Dimensions
      warrantyInformation: String
      shippingInformation: String
      availabilityStatus: String
      reviews: [Review!]!
      returnPolicy: String
      minimumOrderQuantity: Int     # ← Fixed
      meta: Meta
      images: [String!]!
      thumbnail: String!
    }

    type ProductsResponse {
      products: [Product!]!
      total: Int!
      skip: Int!
      limit: Int!
    }

    type Query {
      products(limit: Int = 20, skip: Int = 0): ProductsResponse!
      product(id: ID!): Product
      searchProducts(q: String!): [Product!]!
      categories: [String!]!
      productsByCategory(category: String!): [Product!]!
    }
  `,
    resolvers: {
        Query: {
          products: async (_, {limit, skip}) =>{
             const data= await fetchFromDummyJSON(`/products?limit=${limit}&skip=${skip}`)
             return data;
          },
          product: async (_, {id}) =>{
            const product= await fetchFromDummyJSON(`/products/${id}`);
            return product;
          },
          searchProducts: async (_,{q}) => {
            const data = await fetchFromDummyJSON(`/products/search?q=${encodeURIComponent(q)}`);
              return data.products || [];
          },
          categories: async () => {
            return await fetchFromDummyJSON(`/products/categories`)
          },
            productsByCategory: async (_,{category}) => {
            const data = await fetchFromDummyJSON(`/products/category/${category}`);
            return data.products || [];
          }
        },
    }
});

const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/graphql',
})

export const GET = yoga.handleRequest
export const POST = yoga.handleRequest