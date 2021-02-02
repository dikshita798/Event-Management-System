const User = require('../models/user')
const Event = require('../models/event')

exports.getParticipants = (req, res) => {
  User.findByType('participant')
    .then((users) => {
      res.json({
        participants: users,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getVolunteers = (req, res) => {
  User.findByType('volunteer')
    .then((users) => {
      res.json({
        volunteers: users,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getEvents = (req, res) => {
  Event.fetchAll()
    .then((events) => {
      res.json({
        events: events,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.addVolunteer = (req, res) => {
  const name = req.body.name
  const volunteer = new User(name, null, null, 'volunteer')
  volunteer
    .save()
    .then((result) => {
      res.json({
        status: 'success',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.addEvent = (req, res) => {
  const name = req.body.name
  const startdate = req.body.startdate
  const enddate = req.body.enddate
  const organizer = req.body.organizer
  const description = req.body.description

  const event = new Event(name, startdate, enddate, organizer, description)
  event
    .save()
    .then((result) => {
      res.json({
        status: 'success',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
