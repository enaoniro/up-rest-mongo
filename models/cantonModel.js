const mongoose = require('mongoose')

const cantonSchema = new mongoose.Schema(
  {
    cantonname: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = mongoose.model('Canton', cantonSchema)