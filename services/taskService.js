const asyncHandler = require('express-async-handler')

const Task = require('../models/taskModel')
const Target = require('../models/targetModel')
const Record = require('../models/recordModel')
const Student = require('../models/studentModel')

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  // Get all task from MongoDB
const task = await Task.find().lean()

// If no task 
if (!task?.length) {
    return res.status(400).json({ message: 'No task found' })
}

// Add groupname to each task before sending the response 
// See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
// You could also do this with a for...of loop
const taskWithStudent = await Promise.all(task.map(async (task) => {
    const student = await Student.findById(task.student).lean().exec()
    return { ...task, studentname: student.first_name }
}))

res.json(taskWithStudent)
})

// @desc Create new task
// @route POST /task
// @access Private
const addTask = asyncHandler(async (req, res) => {
const { student, isCompleted, task1, task2, task3, task4, task5 } = req.body

// Confirm data
if (!student) {
    return res.status(400).json({ message: 'All fields are required' })
}

// // Check for duplicate task1
// const duplicate = await Task.findOne({ task1 }).lean().exec()

// if (duplicate) {
//     return res.status(409).json({ message: 'Duplicate task task1' })
// }

// Create and store the new task2 
const task = await Task.create({ student, isCompleted, task2, task1, task3, task4, task5 })

if (task) { // Created 
    return res.status(201).json({ message: 'New task created' })
} else {
    return res.status(400).json({ message: 'Invalid task data received' })
}

})

// @desc Update a task
// @route PATCH /task
// @access Private
const updateTask = asyncHandler(async (req, res) => {
const { _id, task2, task3, student, isCompleted, task4, task5, task1 } = req.body

console.log(req.body._id)

// Confirm data
// if (!id || !task2 || !task1 || !task3 || !task4 || !task5) {
//     return res.status(400).json({ message: 'All fields are required' })
// }

// Confirm task exists to update
const task = await Task.findById(_id).exec()
console.log(task)

if (!task) {
    return res.status(400).json({ message: 'Task not found' })
}

// Check for duplicate task1
const duplicate = await Task.findOne({ _id }).lean().exec()

// Allow renaming of the original task 
if (duplicate && duplicate?._id.toString() !== _id) {
    return res.status(409).json({ message: 'Duplicate task' })
}

task._id = _id
task.task2 = task2
task.task1 = task1
task.task3 = task3
task.task4 = task4
task.task5 = task5
task.student = student
task.isCompleted = isCompleted


const updatedTask = await task.save()

res.json(`'${updatedTask.id}' updated`)
})


const updateTaskCompleted = asyncHandler(async (req, res) => {
    const { _id, task2, task3, student, isCompleted, task4, task5, task1 } = req.body
    
    console.log(req.body._id)
    
    // Confirm data
    // if (!id || !task2 || !task1 || !task3 || !task4 || !task5) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }
    
    // Confirm task exists to update
    const task = await Task.findById(_id).exec()
    console.log(task)
    
    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }
    
    // Check for duplicate task1
    const duplicate = await Task.findOne({ _id }).lean().exec()
    
    // Allow renaming of the original task 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate task' })
    }
    
    task._id = _id
    task.task2 = task2
    task.task1 = task1
    task.task3 = task3
    task.task4 = task4
    task.task5 = task5
    task.student = student
    task.isCompleted = !task.isCompleted
    
    
    
    const updatedTask = await task.save()
    
    res.json(`'${updatedTask.id}' task is completed`)
    })

// @desc Delete a task
// @route DELETE /task
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
const { id } = req.body
console.log( id )

// Confirm data
if (!id) {
    return res.status(400).json({ message: 'Task ID required' })
}

// Confirm task exists to delete 
const task = await Task.findById(id).exec()

if (!task) {
    return res.status(400).json({ message: 'Task not found' })
}

try {

 // Delete parent document
 await task.deleteOne()
 // Delete all child documents referencing the deleted parent
 await Target.deleteMany({ task:id });
 await Record.deleteMany({task:id});
 console.log('Cascading delete completed successfully.');

} catch (error) {
 console.error('Error during cascading delete:', error);
}

const reply = `Task '${result.task1}' with ID ${result._id} deleted`

res.json(reply)
})

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskCompleted
}