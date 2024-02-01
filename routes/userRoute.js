const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const body = require('express').urlencoded({extended:true})
const guardAuth = require('./guarAuth')

router.get('/register',guardAuth.notAuth,userController.getPageRegister)
router.post('/register',body,userController.signup)
router.get('/login',guardAuth.notAuth,userController.getPageLogin)
router.post('/login',body,userController.signin)
router.post('/logout', userController.logout)

module.exports = router;