const sql = require('../db')

class ShowtimesController {

    // [GET] /showtimes
    showtimes(req, res) {
        sql.selectShowtimes(req, res)
    }
}

module.exports = new ShowtimesController;