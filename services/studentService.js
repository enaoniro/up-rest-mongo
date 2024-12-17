const asyncHandler = require('express-async-handler')

const Student = require('../models/studentModel')
const Group = require('../models/groupModel')
const Task = require('../models/taskModel')
const Target = require('../models/targetModel')
const Record = require('../models/recordModel')


//asagisi codelanmak icin bekliyor

 const getStudentsByGrup = asyncHandler(async (req, res) => {
    const groupId = req.body;
    const group = await Group.findOne(groupId).lean().exec()
    res.json(group);
  });
  
  const getStudentsById = asyncHandler(async (req, res) => {
    const studentId = req.body;
    const student = await Student.findOne(studentId).lean().exec()
    res.json(student);
  });
  


// @desc    Get students
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  // Get all students from MongoDB

  const students = await Student.find().lean()

  // If no students 
  if (!students?.length) {
      return res.status(400).json({ message: 'No students found' })
  }

  // Add groupname to each student before sending the response 
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
  // You could also do this with a for...of loop
  const studentsWithGroup = await Promise.all(students.map(async (student) => {
      const group = await Group.findById(student.group).lean().exec()
      return { ...student, groupname: group.groupname }
  }))

  res.json(studentsWithGroup)
})

// @desc Create new student
// @route POST /students
// @access Private
const addStudent = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, group, img } = req.body

  // Confirm data
  if (!first_name || !last_name || !email || !group) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Check for duplicate email
  const duplicate = await Student.findOne({ email }).lean().exec()

  if (duplicate) {
      return res.status(409).json({ message: 'Duplicate student email' })
  }


  const studentObject = { first_name, last_name, group, email }
  // Create and store the new group 
  const student = await Student.create(studentObject)

  if (student) { // Created 
      return res.status(201).json({ message: 'New student created' })
  } else {
      return res.status(400).json({ message: 'Invalid student data received' })
  }
  res.json(`${student.name} ${student.email} ${student.group} is added`)

})

// @desc Update a student
// @route PATCH /students
// @access Private
const updateStudent = asyncHandler(async (req, res) => {
  const { _id, group, first_name, last_name, img, email } = req.body
  
  console.log(req.body._id)


  // Confirm data
  if (!_id ) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm student exists to update
  const student = await Student.findById(_id).exec()

  if (!student) {
      return res.status(400).json({ message: 'Student not found' })
  }

  // Check for duplicate email
  const duplicate = await Student.findOne({ email }).lean().exec()

  // Allow renaming of the original student 
  if (duplicate && duplicate?._id.toString() !== _id) {
      return res.status(409).json({ message: 'Duplicate student email' })
  }

  student.group = group
  student.email = email
  student.first_name = first_name
  student.last_name = last_name
  student.img = img
  

  const updatedStudent = await student.save()

  res.json(`'${updatedStudent.email}' updated`)
})

// @desc Delete a student
// @route DELETE /students
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
  const id  = req.params.id
  console.log(id)

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Student ID required' })
  }

  // Confirm student exists to delete 
  const student = await Student.findById(id).exec()

  
    // Find all classes associated with the teacher
    const tasks = await Task.find({ student:id });

    // Delete each class and its associated students
    for (const task of tasks) {
      await Task.deleteMany({ student:id });
      await Target.deleteMany({task:task._id});
      await Record.deleteMany({task:task._id});
    }

    // Finally, delete the teacher
    await Student.findByIdAndDelete(id);

  // if (!student) {
  //     return res.status(400).json({ message: 'Student not found' })
  // }

  //     // Delete parent document
  //     await student.deleteOne()
  //     // Delete all child documents referencing the deleted parent
  //     await Task.deleteMany({ student:id });
  //     await Target.deleteMany({ task:Task._id });
  //     await Record.deleteMany({ task:Task._id });
  //     console.log('Cascading delete completed successfully.');
  

  const reply = `Student '${student.email}' with ID ${student._id} deleted`

  res.json(reply)
})

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentsByGrup,
  getStudentsById
}