const mongodb = require('mongodb')

const User = require('../models/user')
const Event = require('../models/event')

exports.getEvent = (req, res) => {
  const eventId = req.params.eventId
  Event.findById(eventId)
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

exports.registerEvent = (req, res) => {
  const eventId = req.params.eventId
  const participantId = req.body.userId
  User.findById(participantId).then((participantData) => {
    Event.findById(eventId)
      .then((event) => {
        let registered = participantData.events
        if (registered === undefined) {
          registered = [event.name]
        } else {
          registered.push(event.name)
        }
        console.log(registered)
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
  })
}
