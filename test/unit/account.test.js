const expect = require('chai').expect
const request = require('supertest')

const app = require('app.js')
const Account = require('models').Account

describe('accounts', () => {

  before(() => {
    return Account.sync({force: true}).then((msg) => {
      Account.create({firstName: 'Jon', lastName: 'Snow', email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
      Account.create({firstName: 'Tyrion', lastName: 'Lannister', email: 'tyrionlannister@gmail.com', password: 'tr14lbyf1r3'})
      Account.create({firstName: 'Rob', lastName: 'Stark', email: 'robstark@gmail.com', password: 'r0bst4rk', passwordToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg'})
      Account.create({firstName: 'Tywin', lastName: 'Lannister', email: 'tywinlannister@gmail.com', password: 'tyw1nl4nn15t3r', passwordToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA'})
    })
  })

  after(() => {
    return Account.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create an account', () => {
      const newAccount = {
        firstName: 'Little',
        lastName: 'Finger',
        email: 'LITTLEFINGER@gmail.com',
        password: 'ch405154l4dd3r'
      }
      return Account.create(newAccount)
      .then((account) => {
        expect(account.email).equal(newAccount.email.toLowerCase())
        expect(account.passwordHash).not.equal(newAccount.password)
      })
    })

    it('should get an account by ID', () => {
      return Account.findById(1)
      .then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should get an account by email and password', () => {
      return Account.findAccount('jonsnow@gmail.com', '1kn0wn0th1ng')
      .then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should generate a password token', () => {
      return Account.emailPasswordToken('jonsnow@gmail.com')
      .then((token) => {
        expect(token).to.be.a('string')
      })
    })

    it('should decrypt a password token', () => {
      // This token does not have an expiry date !
      // This token should give back a value of
      //     { data: 'jonsnow@gmail.com', iat: 1507757856 }
      // once it is decrypted properly
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiam9uc25vd0BnbWFpbC5jb20iLCJpYXQiOjE1MDc3NTc4NTZ9.Fe_0-GE76jiDz1-atXBnq6qhkziRVUjChppTPvK8ZVw'
      return Account.verifyToken(token)
      .then((decrypted) => {
        expect(decrypted.data).equal('jonsnow@gmail.com')
      })
    })

    it('should contain verification token for all accounts', () => {
      Account.findAll()
      .then(accounts => {
        for (var i=0; i<accounts.length; i++) {
          expect(accounts[i].verificationToken).to.be.a('string')
        }
      })
    })
  })

  describe('controllers', () => {
    it('GET /login', () => {
      return request(app)
        .get('/settings')
        .expect(302)
        .expect('Location', '/login')
    })

    it('POST /login', () => {
      return request(app)
        .post('/login')
        .send({email: 'valarmorghulis@gmail.com', password: 'br4v0s'})
        .expect(302)
        .expect('Location', '/login')
    })

    it('POST /register', () => {
      return request(app)
        .post('/register')
        .send({
          firstName: 'Khal',
          lastName: 'Drogo',
          email: 'khaldrogo@gmail.com',
          password: 'd0thr4k1'
        })
        .expect(302)
    })

    it('POST /resetpassword valid token', () => {
      return request(app)
        .post('/resetpassword')
        .send({
          passwordToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA',
          password: '1234567'
        })
        .expect(302)
    })

    it('GET /verifypasswordtoken valid passwordToken', () => {
      return request(app)
        .get('/verifypasswordtoken/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg')
        .expect(302)
    })

    it('GET /verifypasswordtoken invalid passwordToken', () => {
      return request(app)
        .get('/verifypasswordtoken/1')
        .expect(404)
    })
  })
})
