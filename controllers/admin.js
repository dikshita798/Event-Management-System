const mongodb = require('mongodb');

const User = require('../models/user');
const Event = require('../models/event');

exports.getParticipants = (req, res) => {
    User.findByType('participant')
    .then(users => {
        console.log(users);
        res.json({
            status: "success"
        })
    })
    .catch( err => {console.log(err)})
};

exports.getVolunteers = (req, res) => {
    User.findByType('volunteer')
    .then(users => {
        console.log(users);
        res.json({
            status: "success"
        })
    })
    .catch( err => {console.log(err)})
};

exports.getEvents = (req, res) => {
    Event.fetchAll()
    .then(events => {
        console.log(events);
        res.json({
            status: "success"
        })
    })
    .catch( err => {console.log(err)})
};

exports.addVolunteer = (req, res) => {
    const name = req.body.name;
    const volunteer = new User(name, null, null, 'volunteer')
    volunteer.save()
    .then(result => {
        res.json({
            status: "success"
        })
    })
    .catch( err => {console.log(err)})
};

exports.addEvent = (req, res) => {
    const name = req.body.name;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const organizer = req.body.organizer
    const description = req.body.description

    const event = new Event(name, startdate, enddate, organizer, description);
    event.save()
    .then(result => {
        res.json({
            status: "success"
        })
    })
    .catch( err => {console.log(err)})
};