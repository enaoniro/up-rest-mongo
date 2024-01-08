const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const checkUser = asyncHandler(async (req, res) => {
  const auth0User = req.body;
  const usermail = {
    email: auth0User.email,
  }

  console.log(usermail)
    // const { email } = req.body
  
    // Check for user email
    const user = await User.findOne(usermail)

    console.log(user)
  
    if (user) {
      res.json(user
        // {
        // _id: user.id,
        // username: user.username,
        // email: user.email,
        // role:user.role,
        // }
    )
    } else {
      res.status(400)
      throw new Error('Invalid credentials')
    }
  })
  


// @desc Get all users
// @route GET /users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const addUser = asyncHandler(async (req, res) => {
    const { username, email, role } = req.body

    // Confirm data
    if (!username || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const userObject = { username, email, role }

//     // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, role, email } = req.body


    console.log(req.body._id)

    // Confirm data 
    if (!_id || !username || !email || !role) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(_id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user._id = _id
    user.username = username
    user.role = role
    user.email = email

  
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const id  = req.params.id
    console.log(id)

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    checkUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
}