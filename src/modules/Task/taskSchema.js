export default {
  type: `
    type Task {
      id: ID!
      label: String!
      status: String!
      creator: User!
      users: [User]
      createdAt: Date
      updatedAt: Date
    }

    input UpdateTaskData {
      label: String
      status: String
    }
  `,

  query:`
    tasks: [Task]
    task(id: String!): Task
  `,

  mutation: `
    createTask(label: String!): Task!
    updateTask(id: String!, data: UpdateTaskData): Task
    deleteTask(id: String!): Int
    addUserToTask(taskId: String!, userId: String!): Task
  `
}
