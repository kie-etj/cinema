const express = require('express')
const router = express.Router()

const ticketsController = require('../controllers/TicketsController')

router.use('/seats', ticketsController.seats)
router.use('/seats-handler', ticketsController.seatsHandler)
router.use('/cart', ticketsController.cart)
router.use('/delete-cart', ticketsController.deleteCart)
router.use('/payment', ticketsController.payment)




router.use('/', ticketsController.index)

module.exports = router
