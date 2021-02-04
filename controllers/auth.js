const User = require('../models/user')

exports.registerVolunteer = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  User.findByType('volunteer')
    .then((users) => {
      users.forEach((userData) => {
        if (userData.name === name && userData.email === email) {
          const user = new User(
            name,
            email,
            password,
            'volunteer',
            userData._id
          )
          user
            .save()
            .then((result) => {
              req.json({
                status: 'Registered!',
              })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.loginVolunteer = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findByType('volunteer')
    .then((users) => {
      users.forEach((userData) => {
        if (userData.email === email && userData.password === password) {
          req.json({
            status: 'Logged In',
            user: {
              id: userData._id,
              name: userData.name,
              email: userData.email,
            },
          })
        }
      })
      req.json({
        status: 'Invalid Credentials!',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.logoutVolunteer = (req, res) => {
  res.json({
    status: 'Logged Out!',
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
      req.json({
        status: 'Registered!',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.loginParticipant = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findByType('participant')
    .then((users) => {
      users.forEach((userData) => {
        if (userData.email === email && userData.password === password) {
          req.json({
            status: 'Logged In',
            user: {
              id: userData._id,
              name: userData.name,
              email: userData.email,
            },
          })
        }
      })
      req.json({
        status: 'Invalid Credentials!',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.logoutParticipant = (req, res) => {
  res.json({
    status: 'Logged Out!',
  })
}
