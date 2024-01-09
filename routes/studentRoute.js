const express = require('express')
const router = express.Router()
const studentService = require('../services/studentService.js')

router.route('/')
.post(studentService.addStudent)
// .post(studentService.checkStudent)
.get(studentService.getStudents)
router.route('/:id').get(studentService.getStudentsByGrup)
router.route('/byId/:id').get(studentService.getStudentsById)
router.route('/').put(studentService.updateStudent) 
router.route('/:id').delete(studentService.deleteStudent)

module.exports = router