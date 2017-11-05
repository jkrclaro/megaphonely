'use strict'

const nodeSchedule = require('node-schedule')

const Content = require('models').Content
const Social = require('models').Social
const Schedule = require('models').Schedule
const twitterService = require('services/twitter')
const facebookService = require('services/facebook')

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('socialIds', 'You must choose a social account').notEmpty()
  req.assert('publishAt', 'You must specify a scheduling date').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.socialIds == 'string') {
    req.body.socialIds = [req.body.socialIds]
  }

  if (req.body.publishAt == 'Today') {
    let publishAt = new Date()
    publishAt.setSeconds(publishAt.getSeconds() + 1);
    req.body.publishAt = publishAt.toISOString()
  } else {
    let publishAt = new Date(req.body.publishAt)
    publishAt.toISOString()
    req.body.publishAt = publishAt
  }

  const message = req.body.message
  const socialIds = req.body.socialIds
  const publishAt = req.body.publishAt
  const file = req.file || {}
  const filename = file.filename || ''

  Content.create({message: message, publishAt: publishAt, filename: filename})
  .then(content => {
    Social.findAll({
      where: {socialId: socialIds, accountId: req.user.id, isConnected: true}
    })
    .then(socials => {
      for(let i=0; i<socials.length; i++) {
        let social = socials[i]
        social.addContent(content)
        nodeSchedule.scheduleJob(publishAt, (err, info) => {
          Schedule.findOne({
            where: {content_id: content.id, social_id: social.id}
          })
          .then(schedule => {
            if(social.provider == 'twitter') {
              twitterService.post(
                message,
                req.file,
                social.accessTokenKey,
                social.accessTokenSecret,
                (err, data) => {

                if(err) {
                  schedule.update({
                    isSuccess: false,
                    isPublished: true,
                    statusCode: err.code,
                    statusMessage: err.message
                  })
                } else {
                  schedule.update({
                    isSuccess: true,
                    isPublished: true,
                    statusCode: data.statusCode,
                    statusMessage: data.headers.status
                  })
                }
              })
            } else if (social.provider == 'facebook') {
              facebookService.post(
                message,
                req.file,
                social.socialId,
                social.accessTokenKey,
                (err, data) => {

                if(err) {
                  schedule.update({
                    isSuccess: false,
                    isPublished: true,
                    statusCode: err.code,
                    statusMessage: err.error_user_msg
                  })
                } else {
                  schedule.update({
                    isSuccess: true,
                    isPublished: true,
                    statusCode: 200,
                    statusMessage: 'Success'
                  })
                }
              })
            } else {
              console.log(`'${social.provider}' provider not yet implemented`)
            }
          })
        })
      }
    })
  })

  const flashMessage = `Succesfully scheduled content`
  req.flash('success', flashMessage)
  res.header('flash-message', flashMessage)
  return res.redirect('/dashboard')
}
