export default {
  type: `
    scalar Date

    type User {
      id: ID!
      username: String!
      password: String!
      createdAt: Date
    }

    type Me {
      id: ID!
      username: String!
      token: String!
      createdAt: Date
    }
  `,

  query:`
    users: [User]
    user(id: String!): User
    me: Me!
  `,

  mutation: `
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): String!
  `
}
