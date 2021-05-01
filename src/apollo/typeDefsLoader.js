/**
 * TypeDefs loader
 * 
 * This file made typeDefs loading easier
 */

import { gql } from 'apollo-server-express'
import UserDef from '../modules/User/userSchema'
import TaskDef from '../modules/Task/taskSchema'

const defs = [UserDef, TaskDef]

let typesString = ''
let queryString = ''
let mutationString = ''

for (const def of defs) {
  typesString += def.type
  queryString += def.query
  mutationString += def.mutation
}

export default gql`type Mutation { ${mutationString} } ${typesString} type Query { ${queryString} }`
