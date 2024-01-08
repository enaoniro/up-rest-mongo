const express = require('express')
const router = express.Router()
const 
 groupService
 = require('../services/groupService')

router.route('/').get(groupService.getGroups)
router.route('/').post(groupService.addGroup)
router.route('/').put(groupService.updateGroup)
router.route('/:id').delete(groupService.deleteGroup)

module.exports = router