const express = require('express')
const router = express.Router()

const siteController = require('../controllers/SiteController')

router.use('/login', siteController.login)
router.use('/register', siteController.register)
router.use('/logout', siteController.logout)
router.use('/user', siteController.user)


router.use('/authenticated-login', siteController.authenticatedLogin)
router.use('/register-handler', siteController.registerHandler)
router.use('/user-details-update', siteController.userDetailsUpdate)
router.use('/user-password-update', siteController.userPasswordUpdate)



router.use('/', siteController.home)

module.exports = router
