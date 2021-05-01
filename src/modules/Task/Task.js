import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['PENDING', 'DONE'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }
})

export default mongoose.model('Task', taskSchema)

