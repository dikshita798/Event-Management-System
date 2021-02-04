const mongodb = require('mongodb')

const User = require('../models/user')
const Event = require('../models/event')

exports.getEvent = (req, res) => {
  const eventId = req.params.eventId
  Event.findById(eventId)
    .then((event) => {
      res.json({
        event: event,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.registerEvent = (req, res) => {
  const eventId = req.params.eventId
  const participantId = req.body.userId
  User.findById(participantId).then((participantData) => {
    Event.findById(eventId)
      .then((event) => {
        let registered = participantData.events
        if (registered === undefined || registered === null) {
          registered = [event._id]
        } else {
          registered.push(event._id)
        }
        const participant = new User(
          participantData.name,
          participantData.email,
          participantData.password,
          participantData.type,
          registered,
          participantData._id
        )
        participant
          .save()
          .then((result) => {
            User.findById(participantData._id).then((participant) => {
              Event.fetchAll().then((eventsData) => {
                const events = []
                eventsData.forEach((event) => {
                  participant.events.forEach((e) => {
                    if (e.equals(event._id)) {
                      events.push(event)
                    }
                  })
                })
                res.json({
                  events: events,
                })
              })
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
}
