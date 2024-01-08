const express = require('express')
const router = express.Router()
const {
  getTargets,
  addTarget,
  updateTarget,
  deleteTarget,
} = require('../services/targetService')

router.route('/').get( getTargets).post( addTarget)
router.route('/').delete( deleteTarget).put( updateTarget)

module.exports = router