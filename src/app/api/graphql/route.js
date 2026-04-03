import { createYoga, createSchema } from "graphql-yoga";

const schema = createSchema({
    typeDefs: `
    type Query {
       hello: String!
       users: [User]!
    }
     
    type User {
      id: ID!
      name: String!
      email: String!
    }

    type Mutation {
    addUser(name: String!, email: String!): User!
    }
    `,
    resolvers: {
        Query: {
            hello: () => 'Hello from GraphQL + Next.js App Router (JavaScript)!',
            users: () => [
                {
                    id : '1',
                    name: "Mushahid Raza",
                    email: "mushahidr317gamil.com"
                },
                {
                    id: '2',
                    name: "Mohammad Raza",
                    email: "razaraza@gamil.com"
                },
                {
                    id: '3',
                    name: "Sunny singh",
                    email: "sunny@gamil.com"
                },
                {
                    id: '4',
                    name: "Mayank Dangi",
                    email: "mayank@gamil.com"
                },
                {
                    id: '5',
                    name: "Atikant Sharma",
                    email: "atikant@gamil.com"
                },
                {
                    id: '6',
                    name: "Salman Idrisi",
                    email: "salman@gamil.com"
                },
                {
                    id: '7',
                    name: "Tanveer Ansari",
                    email: "Tanveer@gamil.com"
                },
            ]
        },
        Mutation: {
            addUser: (_, {name, email}) =>{
                return {
                    id: Data.now().toString(),
                    name,
                    email,
                }
            }
        }
    }
});

const yoga = createYoga({
    schema,
    graphqlEndpoint: '/api/graphql',
})

export const GET = yoga.handleRequest
export const POST = yoga.handleRequest