const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    recipeCount: Int
    savedRecipes: [Recipe]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Recipe {
    recipeId: ID!
    method: String
    name: String
    image: String
    link: String
  }

  input InputRecipe {
    recipeId: String
    name: String
    method: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRecipe(newRecipe: InputRecipe!): User
    removeRecipe(recipeId: ID!): User
  }
`;

module.exports = typeDefs;
