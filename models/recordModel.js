const mongoose = require('mongoose')


const recordSchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Task',
    },
    record1: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    record2: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    record3: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    record4: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
    record5: {
      type: Number,
      required: [false, 'Please add a number value'],
    },
  },
  {
    timestamps: false,
  }
)

module.exports = mongoose.model('Record', recordSchema)