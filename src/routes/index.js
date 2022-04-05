const moviesRouter = require('./movies')
const siteRouter = require('./site')
const showtimesRouter = require('./showtimes')
const ticketsRouter = require('./tickets')
const cinemasRouter = require('./cinemas')


function route(app) {

    app.use('/movies', moviesRouter)
    app.use('/cinemas', cinemasRouter)
    app.use('/showtimes', function(req, res, next) {!req.cookies.user ? res.redirect('/login') : next()}, showtimesRouter)
    app.use('/tickets', function(req, res, next) {!req.cookies.user ? res.redirect('/login') : next()}, ticketsRouter)

    app.use('/', siteRouter)
  
}

module.exports = route
