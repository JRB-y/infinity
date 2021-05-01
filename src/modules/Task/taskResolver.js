import Task from './Task'

import { UserInputError } from 'apollo-server-errors'
import checkAuth from '../../middleware/checkAuth'
import User from '../User/User'

const PENDING = 'PENDING'
const COMPLETED = 'COMPLETED'

const Query = {
  tasks: async (_, args, context) => {
    const user = await checkAuth(context)
    const tasks = await Task.find({ creator: user.id }).populate(['creator', 'users'])
    return tasks
  },
  task: async (_, { id }, context) => {
    const user = await checkAuth(context)
    const task = await task.findOne({ _id: id, creator: user.id }).populate(['creator', 'users'])

    if (!task) {
      throw new Error(`Can't get this task from your tasks!`)
    }

    return task
  }
}

const Mutation = {
  createTask: async (_, { label }, context) => {
    const user = await checkAuth(context)
    if (!label) {
      throw new UserInputError(`username or password cannot be empty!`)
    }

    const task = await new Task({ label, creator: user, status: PENDING })
    return task.save()
  },
  updateTask: async (_, args, context) => {
    const user = await checkAuth(context)
    const id = args.id

    if (!args.data) {
      throw new UserInputError(`Need to have data property inside the args!`)
    }

    const { label, status } = args.data

    if (!label && !status) {
      throw new UserInputError(`We need to update at least the label or the status!`)
    }

    if (status && status !== PENDING && status !== COMPLETED) {
      console.log('status', status)
      throw new UserInputError(`Status can be 'PENDING' or 'COMPLETED' !`)
    }

    const data = {}
    if (label) data.label = label
    if (status) data.status = status
    data.updatedAt = new Date()

    const task = await Task.findByIdAndUpdate({ _id: id, creator: user.id }, data, {new: true})

    if (!task) {
      throw new Error(`You can't edit this task!`)
    }

    return task
  },
  deleteTask: async (_, { id }, context) => {
    const user = await checkAuth(context)
    const task = await Task.deleteOne({ _id: id, creator: user.id })
    if (!task) {
      throw new Error(`You can't delete this task!`)
    }
    return task.deletedCount
  },
  addUserToTask: async (_, { taskId, userId }, context) => {
    const currentUser = await checkAuth(context)

    if (currentUser.id === userId) {
      throw new Error('You cant assign todo to yourself')
    }

    let [ task, userToAdd ] = await Promise.all([
      Task.findOne({ _id: taskId, creator: currentUser.id }),
      User.findOne({ _id: userId })
    ])

    if (!task) {
      throw new Error(`Can't get this task from your tasks!`)
    }

    if (!userToAdd) {
      throw new Error(`Can not assign task to invalid user!`)
    }

    if (task.users.includes(userToAdd.id)) {
      throw new Error('User already assigned to this task!')
    }

    task.users.push(userToAdd)

    task = await (await task.save()).populate(['users', 'creator']).execPopulate()
    return task
  }
}

export default { Query, Mutation }
