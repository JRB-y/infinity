import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import db from './config/db'
import typeDefs from './apollo/typeDefsLoader'
import resolvers from './apollo/resolversLoader'

import dotenv from 'dotenv'
dotenv.config()


const start = async () => {
  const app = express()

  // waitting db to connect
  const { DB_HOST, DB_USER, DB_PASSWORD } = process.env
  await db(DB_HOST, DB_USER, DB_PASSWORD)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      /**
       * Here we can format the error for the end user (removing extra stuff like stack and details...)
       * We can use a more robust server loggin error
       */
      return `👎 ${err.message}`
    },
    context: ({ req }) => ({ req })
  })

  server.applyMiddleware({ app })

  const port = process.env.PORT || 4000
  app.listen({ port }, () => {
    console.log(`🚀 Server ready at ${process.env.HOST}:${port}${server.graphqlPath}`)
  })
}

start()
