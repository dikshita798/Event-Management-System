const User = require('../models/user')
const Event = require('../models/event')

exports.loginParticipant = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findByType2('participant')
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

exports.logoutParticipant = (req, res) => {
  res.json({
    status: 'Logged Out!',
  })
}

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
