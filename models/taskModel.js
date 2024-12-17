const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  taskName: {
    type: String,
    required: [true, "Please add a text value"],
  },
  record: {
    type: Number || null,
    required: [false, "Please add a text value"],
  },
  target: {
    type: Number,
    required: [true, "Please add a text value"],
  },
  assignedAt: {
    type: Date,
    required: true,
  },
  deadline: {
        type: Date,
        required: true,
        // get: (value) => value.toISOString().split()  // Returns date in YYYY-MM-DD format
      }
    }, );
    



module.exports = mongoose.model("Task", taskSchema);
