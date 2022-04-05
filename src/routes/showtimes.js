const express = require('express')
const router = express.Router()

const showtimesController = require('../controllers/ShowtimesController')

router.use('/', showtimesController.showtimes)

module.exports = router
