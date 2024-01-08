const express = require('express')
const router = express.Router()
const cantonService = require('../services/cantonService')

router.route('/')
.get(cantonService.getCantons)
.post(cantonService.addCanton)
router.route('/:id').delete(cantonService.deleteCanton)
.put(cantonService.updateCanton)

module.exports = router