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
    .then((event) => {
      console.log(event)
      res.json({
        status: 'success',
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.deleteVolunteer = (req, res) => {
  const userId = req.params.userId
  User.deleteById(userId)
  .then((user) => {
    console.log(user)
    res.json({
      status: 'success',
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
  try {
    const result = Event.updateOne({_id: eventId},{
      $set:{
        name: req.body.name,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        organizer: req.body.organizer,
        description: req.body.description
      }
    })
    res.json({
      status: result
    })
  } catch (err) {
    console.log(err)
  }
}

exports.editVolunteer = (req, res) => {
  const userId = req.params.userId
  const query = { _id: userId }
  const userd={
    $set:{
    "name": req.body.name,
    "email": req.body.email,
    "password": req.body.password,
    "type": req.body.type,
    "events": req.body.events  }}
    const db = getDb()
    db
    .collection('users')
    .updateOne(query,userd)
    .then(updatedDocument => {
      if(updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`)
      } else {
        console.log("No document matches the provided query.")
      }
      res.send(updatedDocument)
      })
    .catch(err => console.error(`Failed to find and update document: ${err}`))
}