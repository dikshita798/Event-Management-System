const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const RefreshToken = require('../models/refreshtoken')
const secret =
  'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'

exports.register = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const type = req.body.type
  const availTypes = ['volunteer', 'participant']
  if (availTypes.indexOf(type) === -1) {
    return res.status(400).send({
      message: 'Invalid Type!',
    })
  } else if (
    name === undefined ||
    email === undefined ||
    password === undefined
  ) {
    return res.status(400).send({
      message: 'Credentials cannot be NULL!',
    })
  } else if (type === 'volunteer') {
    User.findByType(type)
      .then((users) => {
        let user
        users.forEach((userData) => {
          if (userData.name === name && userData.email === email) {
            user = new User(
              name,
              email,
              password,
              type,
              userData.events,
              userData._id
            )
          }
        })
        user
          .save()
          .then((result) => {
            console.log(user)
            return res.json({
              message: 'Registered!',
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                events: user.events,
              },
            })
          })
          .catch((err) => {
            console.log(err)
            res.sendStatus(500)
          })
      })
      .catch((err) => {
        console.log(err)
        res.sendStatus(500)
      })
  } else if (type === 'participant') {
    let user
    user = new User(name, email, password, type)
    console.log(user)
    user.save().then((result) => {
      return res.json({
        message: 'Registered!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      })
    })
  }
}

exports.login = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  // const type = req.body.type
  console.log(email, password)
  // const availTypes = ['volunteer', 'participant', 'admin']
  // if (availTypes.indexOf(type) === -1) {
  //   res.status(400).send({
  //     message: 'Invalid Type!',
  //   })
  // } else
   if (email === undefined || password === undefined) {
    res.status(400).send({
      message: 'Credentials cannot be NULL!',
    })
  } else {
    User.findByMail(email, password)
      .then((user) => {
        // let user
        // users.forEach((userData) => {
        //   console.log(userData)
        //   if (userData.email === email && userData.password === password) {
        //     user = userData
        //   }
        // })
        // console.log(user)
        if (user !== undefined) {
          const refreshtoken = new RefreshToken(
            user._id,
            crypto.randomBytes(40).toString('hex'),
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          )
          const accessToken = RefreshToken.generateJwtToken(user._id)
          refreshtoken
            .saveRefreshToken()
            .then((result) => {
              return res.status(200).json({
                status: 'Logged In!',
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  type: user.type,
                  events: user.events,
                },
                accesstoken: accessToken,
                refreshtoken: refreshtoken.token,
              })
            })
            .catch((err) => {
              console.log(err)
              res.sendStatus(500)
            })
        } else {
          res.status(400).send({
            message: 'Invalid Credentials!',
          })
        }
      })
      .catch((err) => {
        console.log(err)
        res.sendStatus(500)
      })
  }
}

exports.logout = (req, res) => {
  res.json({
    message: 'Logged Out!',
  })
}

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.log('Invalid Auth Value')
        return res.status(403).send({
          message: 'Invalid Auth Value',
        })
      }
      console.log('Authenticated')
      req.user = user
      next()
    })
  } else {
    console.log('Auth Header Absent')
    res.status(401).send({
      message: 'Auth Header Absent',
    })
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
                    message: 'Token renewed',
                    accesstoken: accessToken,
                    refreshtoken: newrefreshtoken.token,
                  })
                })
                .catch((err) => {
                  console.log(err)
                  res.sendStatus(500)
                })
            })
            .catch((err) => {
              console.log(err)
              res.sendStatus(500)
            })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}
