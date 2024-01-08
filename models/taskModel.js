const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    isCompleted: {
      type: Boolean,
      default:false,
    },
    task1: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    task2: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    task3: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    task4: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    task5: {
      type: String,
      required: [true, 'Please add a text value'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Task', taskSchema)