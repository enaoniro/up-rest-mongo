const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    role: {
      type: String,
      default: 'student',
     },
  },
  {
    timestamps: false,
  }
)

module.exports = mongoose.model('User', userSchema)