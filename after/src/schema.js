'use strict'

module.exports = `type Query {
  value(key: String!): String
}

type Mutation {
  value(key: String!, value: String!): String
}`
