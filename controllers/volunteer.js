const User = require('../models/user')
const Event = require('../models/event')
const { addVolunteer } = require('./admin')

exports.loginVolunteer = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  //console.log(email, password)
  User.findByType2('volunteer')
    .then((users) => {
      let user
      users.forEach((userData) => {
        //console.log(userData.email, userData.password)
        if (userData.email === email && userData.password === password) {
          user = userData
        }
      })
      if (user !== undefined) {
        res.json({
          status: 'Logged In',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        })
      } else {
        res.json({
          status: 'Invalid Credentials!',
        })
      }
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
exports.participate = (req, res) => {
  const volunteerId = req.body.userId
  User.findById(volunteerId)
    .then((volunteer) => {
      Event.fetchAll()
        .then((eventsData) => {
          const events = eventsData.filter(
            (event) => event.organizer !== volunteer.name
          )
          res.json({
            events: events,
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
