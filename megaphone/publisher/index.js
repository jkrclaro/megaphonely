'use strict'

const provider = process.argv.slice(2)[0]

const fs = require('fs')

const kue = require('kue')
const isVideo = require('is-video')
const replaceExt = require('replace-ext')

const Schedule = require('models').Schedule
const service = require(`lib/${provider}`)

const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

queue.process(provider, (job, done) => {
  console.log(`Found a ${provider} job`)

  service.post(job.data, (err, data, file) => {
    Schedule.findOne({
      where: {content_id: job.data.contentId, social_id: job.data.socialId}
    })
    .then(schedule => {
      if(err) {
        console.log(`Failed to publish for ${provider}`)
        schedule.update({
          isSuccess: false,
          isPublished: true,
          statusCode: err.statusCode,
          statusMessage: err.statusMessage
        })
      } else {
        console.log(`Successfully posted to ${provider}`)
        schedule.update({
          isSuccess: true,
          isPublished: true,
          statusCode: 200,
          statusMessage: 'Success'
        })
      }
    })

    if(file) {
      const mp4 = replaceExt(file.path, '.mp4')
      fs.unlink(file.path)
      if (isVideo(file.path) && file.path != mp4) {
        fs.unlink(mp4)
      }
    }
    done()
  })
})
