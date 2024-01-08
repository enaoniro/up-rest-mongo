const asyncHandler = require('express-async-handler')


const Canton = require('../models/cantonModel')
const Group = require('../models/groupModel')

// @desc    Get students
// @route   GET /api/students
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
  // Get all groups from MongoDB

  const groups = await Group.find().lean()

  // If no groups 
  if (!groups?.length) {
      return res.status(400).json({ message: 'No groups found' })
  }

  // Add cantonname to each group before sending the response 
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
  // You could also do this with a for...of loop
  const groupsWithCanton = await Promise.all(groups.map(async (group) => {
      const canton = await Canton.findById(group.canton).lean().exec()
      return { ...group, cantonname: canton.cantonname }
  }))

  res.json(groupsWithCanton)
})

// @desc Create new group
// @route POST /groups
// @access Private
const addGroup = asyncHandler(async (req, res) => {
  const { groupname, email, canton } = req.body

  // Confirm data
  if (!groupname || !email || !canton) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Check for duplicate email
  const duplicate = await Group.findOne({ email }).lean().exec()

  if (duplicate) {
      return res.status(409).json({ message: 'Duplicate group email' })
  }

  // Create and store the new canton 
  const group = await Group.create({ groupname, canton, email })

  if (group) { // Created 
      return res.status(201).json({ message: 'New group created' })
  } else {
      return res.status(400).json({ message: 'Invalid group data received' })
  }

})

// @desc Update a group
// @route PATCH /groups
// @access Private
const updateGroup = asyncHandler(async (req, res) => {
  const { _id, canton, groupname, email } = req.body

  // Confirm data
  if (!_id || !canton || !email, !groupname) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm group exists to update
  const group = await Group.findById(_id).exec()

  if (!group) {
      return res.status(400).json({ message: 'Group not found' })
  }

  // Check for duplicate email
  const duplicate = await Group.findOne({ email }).lean().exec()

  // Allow renaming of the original group 
  if (duplicate && duplicate?._id.toString() !== _id) {
      return res.status(409).json({ message: 'Duplicate group email' })
  }

  group.canton = canton
  group.email = email
  group.groupname = groupname
  

  const updatedGroup = await group.save()

  res.json(`'${updatedGroup.email}' updated`)
})

// @desc Delete a group
// @route DELETE /groups
// @access Private
const deleteGroup = asyncHandler(async (req, res) => {
  const id  = req.params.id

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Group ID required' })
  }

  // Confirm group exists to delete 
  const group = await Group.findById(id).exec()

  if (!group) {
      return res.status(400).json({ message: 'Group not found' })
  }

  const result = await group.deleteOne()

  const reply = `Group '${result.email}' with ID ${result._id} deleted`

  res.json(reply)
})


module.exports = {
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
}