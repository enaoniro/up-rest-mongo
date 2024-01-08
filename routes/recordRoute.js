const express = require('express')
const router = express.Router()
const {
  getRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} = require('../services/recordService')

router.route('/').get( getRecords).post( addRecord)
router.route('/').delete( deleteRecord).put( updateRecord)

module.exports = router