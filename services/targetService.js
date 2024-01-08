const asyncHandler = require('express-async-handler')
const Target = require('../models/targetModel')
const Task = require('../models/taskModel')

// @desc    Get targets
// @route   GET /api/targets
// @access  Private
const getTargets = asyncHandler(async (req, res) => {
  // Get all target from MongoDB
const targets = await Target.find().lean()

// If no target 
if (!targets?.length) {
    return res.status(400).json({ message: 'No target found' })
}

// Add groupname to each target before sending the response 
// See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
// You could also do this with a for...of loop
const targetWithGroup = await Promise.all(targets.map(async (target) => {
    const task = await Task.findById(target.task).lean().exec()
    return { ...target }
}))

res.json(targetWithGroup)
})

// @desc Create new target
// @route POST /target
// @access Private
const addTarget = asyncHandler(async (req, res) => {
const { task, target1, target2, target3, target4, target5 } = req.body

// Confirm data
if (!task) {
    return res.status(400).json({ message: 'All fields are required' })
}

// // Check for duplicate target1
// const duplicate = await Target.findOne({ target1 }).lean().exec()

// if (duplicate) {
//     return res.status(409).json({ message: 'Duplicate target target1' })
// }

// Create and store the new target2 
const target = await Target.create({ task, target2, target1, target3, target4, target5 })

if (target) { // Created 
    return res.status(201).json({ message: 'New target created' })
} else {
    return res.status(400).json({ message: 'Invalid target data received' })
}

})

// @desc Update a target
// @route PATCH /target
// @access Private
const updateTarget = asyncHandler(async (req, res) => {
    const { _id, target2, target3, task, target4, target5, target1 } = req.body
    
    console.log(req.body._id)
    
    // Confirm data
    // if (!id || !target2 || !target1 || !target3 || !target4 || !target5) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }
    
    // Confirm target exists to update
    const target = await Target.findById(_id).exec()
    console.log(target)
    
    if (!target) {
        return res.status(400).json({ message: 'Target not found' })
    }
    
    // Check for duplicate target1
    const duplicate = await Target.findOne({ _id }).lean().exec()
    
    // Allow renaming of the original target 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate target' })
    }
    
    target._id = _id
    target.target2 = target2
    target.target1 = target1
    target.target3 = target3
    target.target4 = target4
    target.target5 = target5
    target.task = task
    
    
    const updatedTarget = await target.save()
    
    res.json(`'${updatedTarget.id}' updated`)
    })

// @desc Delete a target
// @route DELETE /target
// @access Private
const deleteTarget = asyncHandler(async (req, res) => {
const { id } = req.body

// Confirm data
if (!id) {
    return res.status(400).json({ message: 'Target ID required' })
}

// Confirm target exists to delete 
const target = await Target.findById(id).exec()

if (!target) {
    return res.status(400).json({ message: 'Target not found' })
}

const result = await target.deleteOne()

const reply = `Target '${result.target1}' with ID ${result._id} deleted`

res.json(reply)
})

module.exports = {
  getTargets,
  addTarget,
  updateTarget,
  deleteTarget,
}