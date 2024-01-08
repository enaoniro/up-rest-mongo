const asyncHandler = require('express-async-handler')

const Record = require('../models/recordModel')
const Task = require('../models/taskModel')

// @desc    Get records
// @route   GET /api/records
// @access  Private
const getRecords = asyncHandler(async (req, res) => {
  // Get all record from MongoDB
const records = await Record.find().lean()

// If no record 
if (!records?.length) {
    return res.status(400).json({ message: 'No record found' })
}

// Add groupname to each record before sending the response 
// See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
// You could also do this with a for...of loop
const recordWithGroup = await Promise.all(records.map(async (record) => {
    const task = await Task.findById(record.task).lean().exec()
    return { ...record }
}))

res.json(recordWithGroup)
})

// @desc Create new record
// @route POST /record
// @access Private
const addRecord = asyncHandler(async (req, res) => {
const { task, record1, record2, record3, record4, record5 } = req.body

// Confirm data
if (!task) {
    return res.status(400).json({ message: 'All fields are required' })
}

// // Check for duplicate record1
// const duplicate = await Record.findOne({ record1 }).lean().exec()

// if (duplicate) {
//     return res.status(409).json({ message: 'Duplicate record record1' })
// }

// Create and store the new record2 
const record = await Record.create({ task, record2, record1, record3, record4, record5 })

if (record) { // Created 
    return res.status(201).json({ message: 'New record created' })
} else {
    return res.status(400).json({ message: 'Invalid record data received' })
}

})

// @desc Update a record
// @route PATCH /record
// @access Private
const updateRecord = asyncHandler(async (req, res) => {
    const { _id, record2, record3, task, record4, record5, record1 } = req.body
    
    console.log(req.body._id)
    
    // Confirm data
    // if (!id || !record2 || !record1 || !record3 || !record4 || !record5) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }
    
    // Confirm record exists to update
    const record = await Record.findById(_id).exec()
    console.log(record)
    
    if (!record) {
        return res.status(400).json({ message: 'Record not found' })
    }
    
    // Check for duplicate record1
    const duplicate = await Record.findOne({ _id }).lean().exec()
    
    // Allow renaming of the original record 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate record' })
    }
    
    record._id = _id
    record.record2 = record2
    record.record1 = record1
    record.record3 = record3
    record.record4 = record4
    record.record5 = record5
    record.task = task
    
    
    const updatedRecord = await record.save()
    
    res.json(`'${updatedRecord.id}' updated`)
    })

// @desc Delete a record
// @route DELETE /record
// @access Private
const deleteRecord = asyncHandler(async (req, res) => {
const { id } = req.body

// Confirm data
if (!id) {
    return res.status(400).json({ message: 'Record ID required' })
}

// Confirm record exists to delete 
const record = await Record.findById(id).exec()

if (!record) {
    return res.status(400).json({ message: 'Record not found' })
}

const result = await record.deleteOne()

const reply = `Record '${result.record1}' with ID ${result._id} deleted`

res.json(reply)
})
module.exports = {
  getRecords,
  addRecord,
  updateRecord,
  deleteRecord,
}