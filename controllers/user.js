const User = require('../models/user')
const Event = require('../models/event')

exports.getEvents = (req, res) => {
  Event.fetchAll()
    .then((events) => {
      res.json({
        events: events,
      })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

exports.getParticipants = (req, res) => {
  User.findByType('participant')
    .then((users) => {
      res.json({
        participants: users,
      })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
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
      res.sendStatus(500)
    })
}

exports.registerForEvent = (req, res) => {
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
            res.sendStatus(500)
          })
      })
      .catch((err) => {
        console.log(err)
        res.sendStatus(500)
      })
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
      res.sendStatus(500)
    })
}

exports.getUser = (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
    .then((user) => {
      //console.log(user)
      res.json({
        user: user,
      })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

exports.addVolunteer = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const volunteer = new User(name, email, null, 'volunteer')
  volunteer
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
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
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
      Event.fetchAll()
        .then((events) => {
          res.json({
            events: events,
          })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

exports.deleteEvent = (req, res) => {
  const eventId = req.params.eventId
  Event.deleteById(eventId)
    .then((result) => {
      Event.fetchAll()
        .then((events) => {
          res.json({
            message: 'Event Deleted',
            events: events,
          })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

exports.deleteVolunteer = (req, res) => {
  const userId = req.params.userId
  User.deleteById(userId)
    .then((result) => {
      User.findByType('volunteer')
        .then((users) => {
          res.json({
            message: 'Volunteer Deleted',
            volunteers: users,
          })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
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
              res.sendStatus(500)
            })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
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
          User.findByType2('volunteer')
            .then((users) => {
              res.json({
                volunteers: users,
              })
            })
            .catch((err) => {
              console.log(err)
              res.sendStatus(500)
            })
        })
        .catch((err) => {
          console.log(err)
          res.sendStatus(500)
        })
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}
