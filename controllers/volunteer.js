const mongodb = require('mongodb')

const User = require('../models/user')
const Event = require('../models/event')
const { addVolunteer } = require('./admin')

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
