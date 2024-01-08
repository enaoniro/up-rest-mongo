const mongoose = require('mongoose')

const studentSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please add a name'],
      },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Group',
     },
    img:{
      type:String,
      required:false,
    }
  },
  {
    timestamps: false,
  }
)

module.exports = mongoose.model('Student', studentSchema)