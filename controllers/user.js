const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('models').User

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  }).catch((err) => {
    done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  email = email.toLowerCase()
  User.findUser(email, password).then((user) => {
    return done(null, user)
  }).catch((err) => {
    return done(err, null)
  })
}))

exports.getUser = (req, res, next) => {
  res.send('I am the user profile')
}

exports.getSignIn = (req, res, next) => {
  res.send('Login page')
}

exports.getSignUp

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}
