const mongoose = require('mongoose')


const targetSchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Task',
    },
    // isCompleted: {
    //   type: Boolean,
    //   default:false,
    // },
    target1: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    target2: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    target3: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    target4: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    target5: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
  },
  {
    timestamps: false,
  }
)

module.exports = mongoose.model('Target', targetSchema)