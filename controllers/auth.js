const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const RefreshToken = require('../models/refreshtoken')
const secret =
  'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'

exports.registerVolunteer = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  User.findByType('volunteer')
    .then((users) => {
      let user
      users.forEach((userData) => {
        if (userData.name === name && userData.email === email) {
          user = new User(
            name,
            email,
            password,
            'volunteer',
            userData.events,
            userData._id
          )
        }
      })
      //console.log(user)
      const refreshtoken = new RefreshToken(
        user._id,
        crypto.randomBytes(40).toString('hex'),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      const accessToken = RefreshToken.generateJwtToken(user._id)
      refreshtoken
        .saveRefreshToken()
        .then((result) => {
          user
            .save()
            .then((result) => {
              return res.json({
                status: 'Registered!',
                accesstoken: accessToken,
                refreshtoken: refreshtoken.token,
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.registerParticipant = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const user = new User(name, email, password, 'participant')
  user
    .save()
    .then((result) => {
      const refreshtoken = new RefreshToken(
        user._id,
        crypto.randomBytes(40).toString('hex'),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      const accessToken = RefreshToken.generateJwtToken(user._id)
      refreshtoken
        .saveRefreshToken()
        .then((result) => {
          return res.json({
            status: 'Registered!',
            accesstoken: accessToken,
            refreshtoken: refreshtoken.token,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.log('Invalid Auth Value')
        return res.sendStatus(403)
      }
      console.log('Authenticated')
      req.user = user
      next()
    })
  } else {
    console.log('Auth Header Absent')
    res.sendStatus(401)
  }
}

exports.refreshtoken = (req, res) => {
  RefreshToken.findByToken(req.body.refreshtoken)
    .then((refreshtokenData) => {
      User.findById(refreshtokenData.userId)
        .then((user) => {
          const refreshtoken = new RefreshToken(
            user._id,
            crypto.randomBytes(40).toString('hex'),
            new Date(Date.now()),
            refreshtokenData._id
          )
          refreshtoken
            .saveRefreshToken()
            .then((result) => {
              const accessToken = RefreshToken.generateJwtToken(user._id)
              const newrefreshtoken = new RefreshToken(
                user._id,
                crypto.randomBytes(40).toString('hex'),
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              )
              newrefreshtoken
                .saveRefreshToken()
                .then((result) => {
                  res.json({
                    status: 'Token renewed',
                    accesstoken: accessToken,
                    refreshtoken: newrefreshtoken.token,
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
}
