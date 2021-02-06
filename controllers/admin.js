const mongodb = require('mongodb')
const User = require('../models/user')
const Event = require('../models/event')
const getDb = require('../utils/database').getDb

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
        name: req.body.name,
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

exports.deleteEvent = (req, res) => {
  const eventId = req.params.eventId
  Event.deleteById(eventId)
    .then((result) => {
      res.json({
        status: 'Event Deleted',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.deleteVolunteer = (req, res) => {
  const userId = req.params.userId
  User.deleteById(userId)
    .then((result) => {
      res.json({
        status: 'Volunteer Deleted',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getUser = (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
    .then((users) => {
      console.log(users)
      res.json({
        status: 'success',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
exports.editEvent = (req, res) => {
  const eventId = req.params.eventId
  const name = req.body.name
  const startdate = req.body.startdate
  const enddate = req.body.enddate
  const organizer = req.body.organizer
  const description = req.body.description
  Event.findById(eventId)
    .then((eventData) => {
      const event = new Event(
        name,
        startdate,
        enddate,
        organizer,
        description,
        eventData._id
      )
      event
        .save()
        .then((result) => {
          Event.fetchAll()
            .then((events) => {
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
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.editVolunteer = (req, res) => {
  const userId = req.params.userId
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  User.findById(userId)
    .then((userData) => {
      const user = new User(
        name,
        email,
        password,
        'volunteer',
        userData.events,
        userData._id
      )
      user
        .save()
        .then((result) => {
          User.findByType('volunteer')
            .then((users) => {
              res.json({
                volunteers: users,
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
