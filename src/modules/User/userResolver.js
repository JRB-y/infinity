import User from './User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server-errors'
import checkAuth from '../../middleware/checkAuth'

const Query = {
  users: async () => {
    const users = await User.find()
    return users
  },
  user: async (_, args) => {
    const user = await User.findOne({ id: args.id })
    return user
  },
  me: async (_, args, context) => {
    const user = await checkAuth(context)
    return { id: user.id, username: user.username, token: user.token, createdAt: user.createdAt }
  }
}

const Mutation = {
  createUser: async (_, { username, password }) => {
    if (!username || !password) {
      throw new UserInputError(`username or password cannot be empty!`)
    }

    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(password.toString(), salt)
    const user = await new User({ username: username, password: pass })

    return user.save()
  },
  login: async (_, { username, password }) => {
    if (!username || !password) {
      throw new UserInputError(`username or password cannot be empty!`)
    }

    const user = await User.findOne({ username })
    if (!user) {
      throw new UserInputError(`No user with this username '${username}'`)
    }

    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass) {
      throw new UserInputError(`Incorrect password`)
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET,
      { expiresIn: 3600 }
    )

    return token
  }
}

export default { Query, Mutation }
