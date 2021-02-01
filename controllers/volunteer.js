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
          console.log(events)
          res.json({
            status: 'success',
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
