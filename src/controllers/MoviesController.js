const sql = require('../db')

class MoviesController {

    // [GET] /movies
    index(req, res) {
        sql.selectMovies(req, res)
    }

    // [GET] /movies/coming-soon
    comingSoon(req, res) {
        sql.selectComingSoon(req, res)
    }

    // [GET] /movies/:slug
    show(req, res) {
        sql.selectDetailsMovie(req, res)
    }
}

module.exports = new MoviesController;