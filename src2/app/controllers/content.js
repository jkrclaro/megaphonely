'use strict'

const isVideo = require('is-video')
const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const Content = require('models').Content
const Social = require('models').Social
const Schedule = require('models').Schedule

exports.postContent = (req, res, next) => {
  const file = req.file || {}
  const filename = file.key.toLowerCase() || ''
  const fileformat = filename.split('.').pop().toLowerCase() || ''
  console.log(`Got file: ${JSON.stringify(req.file, null, 4)}`)

  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('profileIds', 'You must choose a social account').notEmpty()
  req.assert('publishAt', 'You must specify a scheduling date').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  if(filename) {
    const message = `File is not valid. Please visit our FAQs for more info`
    req.checkBody('media', message).isValidFile(filename)
  }

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.profileIds == 'string') {
    req.body.profileIds = [req.body.profileIds]
  }

  if (req.body.publishAt == 'Schedule Now') {
    let publishAt = new Date()
    publishAt.setSeconds(publishAt.getSeconds() + 1);
    req.body.publishAt = publishAt.toISOString()
  } else {
    let publishAt = new Date(req.body.publishAt)
    publishAt.toISOString()
    req.body.publishAt = publishAt
  }

  const message = req.body.message
  const profileIds = req.body.profileIds
  const publishAt = req.body.publishAt

  Content.create({
    message: message,
    publishAt: publishAt,
    filename: filename,
    fileformat: fileformat,
    isVideo: isVideo(filename) ? true : false,
  })
  .then(content => {
    Social.findAll({
      where: {profileId: profileIds, accountId: req.user.id, isConnected: true}
    })
    .then(socials => {
      for(let i=0; i<socials.length; i++) {
        let social = socials[i]
        social.addContent(content)
        .then(success => {
          Schedule.findOne({
            where: {content_id: content.id, social_id: social.id}
          })
          .then(schedule => {
            if(social.provider == 'twitter') {
              const payload = {
                message: message,
                file: req.file,
                accessTokenKey: social.accessTokenKey,
                accessTokenSecret: social.accessTokenSecret,
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                socialId: social.id,
                contentId: content.id,
                title: publishAt
              }

              const job = queue.create('twitter', payload)
              .delay(publishAt)
              .save(err => {
                if(!err) {
                  schedule.update({isQueued: true, jobId: job.id})
                } else {
                  console.error('Error creating twitter job:', err)
                }
              })
            } else if (social.provider == 'facebook') {
              const payload = {
                message: message,
                file: req.file,
                profileId: social.profileId,
                accessToken: social.accessTokenKey,
                socialId: social.id,
                contentId: content.id,
                title: publishAt
              }

              const job = queue.create('facebook', payload)
              .delay(publishAt)
              .save(err => {
                if(!err) {
                  schedule.update({isQueued: true, jobId: job.id})
                } else {
                  console.error('Error creating facebook job:', err)
                }
              })
            } else if (social.provider == 'linkedin') {
              const payload = {
                message: message,
                file: req.file,
                profileId: social.profileId,
                accessToken: social.accessTokenKey,
                socialId: social.id,
                contentId: content.id,
                title: publishAt,
                clientId: process.env.LINKEDIN_CLIENT_ID,
                clientSecret: process.env.LINKEDIN_CLIENT_SECRET
              }

              const job = queue.create('linkedin', payload)
              .delay(publishAt)
              .save(err => {
                if(!err) {
                  schedule.update({isQueued: true, jobId: job.id})
                } else {
                  console.error('Error creating linkedin job:', err)
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
