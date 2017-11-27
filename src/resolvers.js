module.exports = {
  Query: {
    value(obj, { key }, context, info) {
      return context.getValue(key)
    }
  },
  Mutation: {
    value(obj, { key, value }, context, info) {
      return context.setValue(key, value)
    }
  }
}
