const request = require('supertest')
const app = require('app.js')
const expect = require('chai').expect
const Content = require('models').Content

describe('contents', () => {

  before(() => {
    return Content.sync({force: true}, () => {
      models.Content.create({message: 'test1'})
    })
  })

  after(() => {
    return Content.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a content', () => {
      return Content.create({message: 'test message', publishAt: new Date()})
        .then((content) => {
          expect(content).to.be.a('object')
        })
    })
  })

  describe('controllers', () => {
    it('should get the number of content seeds', (done) => {
      request(app)
        .get('/contents')
        .end((err, res) => {
          expect(1).equal(res.body.length)
          done()
        })
    })

    it('should schedule a dummy message that will be published immediately', (done) => {
      request(app)
        .post('/contents/add')
        .send({message: 'test message', publishAt: new Date()})
        .expect(200, done)
    })

    it('should post a message to twitter', (done) => {
      request(app)
        .post('/contents/send/twitter')
        .send({message: new Date()})
        .expect(200, done)
    })
  })

})
