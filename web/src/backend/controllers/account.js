const jwt = require('jsonwebtoken')

const Account = require('models').Account
const { LoginValidator, SignupValidator } = require('validators')

exports.create = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body;
  SignupValidator.validate({ firstName, lastName, email, password})
  .then(valid => Account.create(valid))
  .then(data => res.json(data))
  .catch(error => {
    const message = error.errors[0].message || error.message
    return res.status(500).json({message: message})
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body
  LoginValidator.validate({ email, password })
  .then(valid => Account.findOne({where: { email, password }}))
  .then(account => {
    if(!account) return res.status(401).json({message: 'Invalid credentials'})
    const data = {email: email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (error, token) => {
      if (error) return res.status(500).json({message: 'Could not sign data'})
      return res.status(200).json({token: token})
    })
  })
  .catch(error => res.status(500).json({message: error}))
}

exports.forgotpassword = (req, res, next) => {
  res.json({message: 'success'})
}

exports.settings = (req, res, next) => {
  res.json({message: 'settings!'})
}
