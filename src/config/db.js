import mongoose from 'mongoose'

export default async (host, user, password) => {
  await mongoose.connect(
    `mongodb+srv://${user}:${password}@${host}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) => {
      if (err) {
        console.error('DB Error: ', err)
      } else {
        console.log(`Connected to db ...`)
      }
    }
  )
}
