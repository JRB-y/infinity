import userResolver from '../modules/User/userResolver'
import taskResolver from '../modules/Task/taskResolver'

const resolvers = [userResolver, taskResolver]

let Query = {}
let Mutation = {}

for (const resolver of resolvers) {
  Query = Object.assign(Query, resolver.Query)
  Mutation = Object.assign(Mutation, resolver.Mutation)
}

export default { Query, Mutation }
