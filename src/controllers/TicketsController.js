const sql = require('../db')

class TicketsController {

    // [GET] /tickets/seats
    seats(req, res) {
        sql.renderSeats(req, res)
    }

    // [GET] /ticket
    index(req, res) {
        sql.selectTickets(req, res)
    }

    // [POST] /tickets/seatsHandler
    seatsHandler(req, res) {
        sql.seatsHandler(req, res)
    }

    // [GET] /tickets/cart
    cart(req, res) {
        sql.selectCart(req, res)
    }

    deleteCart(req, res) {
        sql.deleteCart(req, res)
    }

    payment(req, res) {
        sql.paymentTickets(req, res)
    }

}

module.exports = new TicketsController;