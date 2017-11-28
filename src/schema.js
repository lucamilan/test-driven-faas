'use strict'

module.exports = `type Query {
  value(key: String!): String
}

type Mutation {
  set(key: String!, value: String!): String
}`
