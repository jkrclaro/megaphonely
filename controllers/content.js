const Content = require('models').Content

exports.add = (req, res) => {
  Content.create({
    message: req.body.message,
    publishAt: req.body.publishAt
  }).then((content) => {
      res.send(req.body.message)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
}

exports.getAll = (req, res, err) => {
  Content.findAll().then((contents) => {
    res.send(contents)
  }).catch((err) => {
    return next(err)
  })
}

exports.sendTwitter = (req, res, next) => {
  var Twit = require('twit')

  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  T.post('statuses/update', {status: req.body.message}, (err, tweet, msg) => {
    if (err) return next(err)
    res.send(msg)
  })
}
