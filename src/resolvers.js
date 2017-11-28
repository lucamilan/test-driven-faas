module.exports = {
  Query: {
    value(obj, { key }, context, info) {
      return context.getValue(key)
    }
  },
  Mutation: {
    set(obj, { key, value }, context, info) {
      return context.setValue(key, value)
    }
  }
}
