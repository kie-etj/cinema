const express = require('express')
const router = express.Router()

const moviesController = require('../controllers/MoviesController')

router.use('/coming-soon', moviesController.comingSoon)
router.use('/:slug', moviesController.show)

router.use('/', moviesController.index)

module.exports = router
