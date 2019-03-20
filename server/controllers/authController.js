const mongoose = require('mongoose')
const User = mongoose.model('User')


exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name')
  req.sanitizeBody('email')
  req.sanitizeBody('password')

  // Name should not be null and it is 4 to 50 characters
  req.checkBody('name', 'Enter a name').notEmpty()
  req.checkBody('name', 'Name must be between 4 and 50 characters').isLength({min: 4, max: 50})

  // Email is not null and should be valid email
  req.checkBody('email', 'Enter a Password')
    .isEmail()
    .normalizeEmail()

  req.checkBody('password', 'Enter a name').notEmpty()
    req.checkBody('password', 'Password should be between 4 and 10 characters').isLength({min: 4, max: 10})

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0]
    return res.status(400).send(firstError)
  }
  next()
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body
  const user = await new User({ name, email, password })
  await User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message)
    }
    res.json(user)
  })
};

exports.signin = () => {};

exports.signout = () => {};

exports.checkAuth = () => {};
