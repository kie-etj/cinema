const express = require('express')
const router = express.Router()

const cinemasController = require('../controllers/CinemasController')

router.use('/', cinemasController.index)

module.exports = router
