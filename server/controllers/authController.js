const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')

exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name')
  req.sanitizeBody('email')
  req.sanitizeBody('password')

  // Name should not be null and it is 4 to 50 characters
  req.checkBody('name', 'Enter a name').notEmpty();
  req.checkBody('name', 'Name must be between 4 and 50 characters')
    .isLength({min: 4, max: 50});

  // Email is not null and should be valid email
  req.checkBody('email', 'Email is Required').notEmpty();
  req.checkBody('email', 'Email should be a valid email address')
    .isEmail()
    .normalizeEmail();

  // Password should not be null and need to be between 4 and 10 characters
  req.checkBody('password', 'Password is Required').notEmpty();
  req.checkBody('password', 'Password should be between 4 and 10 characters')
    .isLength({min: 4, max: 10});

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
    res.json(user.name)
  })
};

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message)
    }
    if (!user) {
      return res.status(400).json(info.message)
    }
    req.login(user, err => {
      if (err) {
        return res.status(500).json(err.message)
      }
      res.json(user)
    })
  })(req, res, next)

};

exports.signout = (req, res) => {
  res.clearCookie('next-cookie.sid')
  req.logout()
  res.json({ message: 'You are now signed out'})
};

exports.checkAuth = () => {};
