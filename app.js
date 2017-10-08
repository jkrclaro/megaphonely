require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

/**
* Express configs
**/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use(passport.session())

/**
* Controllers
**/
const homeController = require('controllers/home')
const contentController = require('controllers/content')
const userController = require('controllers/user')
app.get('/', homeController.index)
app.get('/users/:id', userController.isAuthenticated, userController.getUser)
app.get('/users', userController.getAllUsers)
app.get('/login', userController.getLogin)
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {res.redirect(`/users/${req.user.id}`)})
app.get('/contents', contentController.getAll)
app.post('/contents/add', contentController.add)
app.post('/contents/send/twitter', contentController.sendTwitter)

module.exports = app
