const sql = require('../db')

class SiteController {

    // [GET] /
    home(req, res) {
        sql.selectTrending(req, res)
    }

    // [GET] /login
    login(req, res) {
        res.render('login')
    }

    // [GET] /register
    register(req, res) {
        res.render('register')
    }

    // [GET] /logout
    logout(req, res) {
        sql.logout(req, res)
    }

    // [POST] /authenticated-login
    authenticatedLogin(req, res) {
        sql.login(req, res)
    }

    // [POST] /register-handler
    registerHandler(req, res) {
        sql.register(req, res)
    }

    // [GET] /user
    user(req, res) {
        if (!req.cookies.user) {
            res.redirect('/login')
        }
        sql.user(req, res)
    }
    userDetailsUpdate(req, res) {
        if (!req.cookies.user) {
            res.redirect('/login')
        }
        sql.userDetailsUpdate(req, res)
    }
    userPasswordUpdate(req, res) {
        if (!req.cookies.user) {
            res.redirect('/login')
        }
        sql.userPasswordUpdate(req, res)
    }

}

module.exports = new SiteController;