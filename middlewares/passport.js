const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const Account = require('models').Account
const Social = require('models').Social

passport.serializeUser((account, done) => {
  if(!account) return done(new Error(404))
  var today = new Date()
  account.update({lastLoginAt: today.setDate(today.getDate())})
  return done(null, account.id)
})

passport.deserializeUser((id, done) => {
  Account.findById(id)
  .then(account => {
    return done(null, account)
  })
  .catch(err => {
    return done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  Account.findAccount(email, password)
  .then(account => {
    return done(null, account)
  })
  .catch(err => {
    return done(err, null)
  })
}))

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/auth/twitter/callback',
  passReqToCallback: true
}, (req, token, tokenSecret, profile, done) => {
  Social.findOne(
    {where: {socialId: profile.id, accountId: req.user.id, provider: 'twitter'}}
  )
  .then(social => {
    if(!social) {
      Social.create({
          accountId: req.user.id,
          socialId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profilePicture: profile.photos[0].value,
          accessTokenKey: token,
          accessTokenSecret: tokenSecret,
          isConnected: true,
          provider: profile.provider
      })
      .then(success => {
        console.log('Created twitter account!')
        Account.findOne({where: {email: req.user.email}})
        .then(account => {
          return done(null, account)
        })
      })
      .catch(err => {
        console.error('Failed to create twitter account!')
        return done(err, null)
      })
    } else {
      // TODO: Only perform update when any fields are different from the
      // newly received data!
      social.update({
          accountId: req.user.id,
          socialId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profilePicture: profile.photos[0].value,
          accessTokenKey: token,
          accessTokenSecret: tokenSecret,
          isConnected: true,
          provider: profile.provider
      })
      .then(success => {
        console.log('Updated twitter account!')
        Account.findOne({where: {email: req.user.email}})
        .then(account => {
          return done(null, account)
        })
      })
      .catch(err => {
        return done(err, null)
      })
    }
  })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  Social.findOne(
    {where: {socialId: profile.id, accountId: req.user.id, provider: 'facebook'}}
  )
  .then(social => {
    if(!social) {
      Social.create({
        accountId: req.user.id,
        socialId: profile.id,
        displayName: profile.displayName,
        profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
        accessTokenKey: accessToken,
        isConnected: true,
        provider: profile.provider
      })
      .then(success => {
        Account.findOne({where: {email: req.user.email}})
        .then(account => {
          console.log('Created facebook account')
          return done(null, account)
        })
      })
      .catch(err => {
        return done(err, null)
      })
    } else {
      social.update({
        accountId: req.user.id,
        socialId: profile.id,
        displayName: profile.displayName,
        profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
        accessTokenKey: accessToken,
        isConnected: true,
        provider: profile.provider
      })
      .then(success => {
        console.log('Updated facebook account')
        Account.findOne({where: {email: req.user.email}})
        .then(account => {
          return done(null, account)
        })
      })
      .catch(err => {
        return done(err, null)
      })
    }
  })
  .catch(err => {
    return done(err, null)
  })
}))

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  const flashMessage = 'Please sign in or register to access this page.'
  req.flash('error', flashMessage)
  res.header('flash-message', flashMessage)
  res.redirect('/login')
}
