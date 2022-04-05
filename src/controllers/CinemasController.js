const sql = require('../db')

class ShowtimesController {

    // [GET] /showtimes
    index(req, res) {
        res.render('cinema')
    }
}

module.exports = new ShowtimesController;