const express = require('express')
const router = express.Router()
const taskService = require('../services/taskService')

router.route('/').get( taskService.getTasks).post(taskService.addTask)
router.route('/').delete(taskService.deleteTask).put(taskService.updateTask)
router.route('/settask').put(taskService.updateTaskCompleted)

module.exports = router