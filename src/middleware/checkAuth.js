import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'
import User from '../modules/User/User'

/**
 * Authentication middelware
 */
export default async (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    if (token) {
      try {
        let user = jwt.verify(token, process.env.SECRET)
        user = await User.findOne({ _id: user.id })
        user.token = token
        return user
      } catch (error) {
        throw new AuthenticationError('Invalid or expired token!')
      }
    }
    throw new Error('Authentication must be \'Bearer [token]\'')
  }
  throw new Error('Authentication header must be provided')
}
