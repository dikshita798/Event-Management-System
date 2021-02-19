const express = require('express')

const userController = require('../controllers/user')
const router = express.Router()

router.get('/events', userController.getEvents)
router.get('/participants', userController.getParticipants)
router.get('/volunteers', userController.getVolunteers)
router.get('/event/:eventId', userController.getEvent)
router.get('/participant/:userId', userController.getUser)

router.post('/register/:eventId', userController.registerForEvent)

// specifically admin routes
router.post('/add-volunteer', userController.addVolunteer)
router.post('/add-event', userController.addEvent)
router.delete('/delete-event/:eventId', userController.deleteEvent)
router.delete('/delete-volunteer/:userId', userController.deleteVolunteer)
router.patch('/edit-volunteer/:userId', userController.editVolunteer)
router.patch('/edit-event/:eventId', userController.editEvent)

module.exports = router
