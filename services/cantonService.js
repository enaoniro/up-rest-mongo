const asyncHandler = require('express-async-handler')

const Canton = require('../models/cantonModel')
// const Group = require('../models/groupModel')

// @desc    Get cantons
// @route   GET /api/cantons
// @access  Private
const getCantons = asyncHandler(async (req, res) => {
  const cantons = await Canton.find()

  res.status(200).json(cantons)
})

// @desc    Set canton
// @route   POST /api/cantons
// @access  Private
const addCanton = asyncHandler(async (req, res) => {

  const { cantonname, email } = req.body;

  //Confirm data
  if (!cantonname || !email) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  const cantonObject = { cantonname, email}

  const canton = await Canton.create(cantonObject)

  res.status(200).json(canton)
})

// @desc    Update canton
// @route   PUT /api/cantons/:id
// @access  Private
const updateCanton = asyncHandler(async (req, res) => {
  const { _id, cantonname, email } = req.body

  // Confirm data 
  if (!_id || !cantonname || !email) {
      return res.status(400).json({ message: 'All fields except password are required' })
  }

  // Does the canton exist to update?
  const canton = await Canton.findById(_id).exec()

  if (!canton) {
      return res.status(400).json({ message: 'Canton not found' })
  }

  // Check for duplicate 
  const duplicate = await Canton.findOne({ email }).lean().exec()

  // Allow updates to the original canton 
  if (duplicate && duplicate?._id.toString() !== _id) {
      return res.status(409).json({ message: 'Duplicate cantonname' })
  }

  canton.cantonname = cantonname
  canton.email = email


  const updatedCanton = await canton.save()

  res.json({ message: `${updatedCanton.cantonname} updated` })
})

// @desc    Delete canton
// @route   DELETE /api/cantons/:id
// @access  Private
const deleteCanton = asyncHandler(async (req, res) => {
  const id  = req.params.id
  console.log(id)

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Canton ID Required' })
  }

  // Does the canton exist to delete?
  const canton = await Canton.findById(id).exec()

  if (!canton) {
      return res.status(400).json({ message: 'Canton not found' })
  }

  const result = await canton.deleteOne()

  const reply = `Cantonname ${result.cantonname} with ID ${result.id} deleted`

  res.json(reply)
})

module.exports = {
  getCantons,
  addCanton,
  updateCanton,
  deleteCanton,
}