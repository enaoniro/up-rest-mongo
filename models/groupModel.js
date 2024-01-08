const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema(
  {
    canton: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Canton',
       },
    groupname: {
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

module.exports = mongoose.model('Group', groupSchema)