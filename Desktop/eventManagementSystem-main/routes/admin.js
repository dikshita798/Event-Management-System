const express = require('express')

const adminController = require('../controllers/admin')
const participantController = require('../controllers/participant')
const router = express.Router()

router.get('/participants', adminController.getParticipants)
router.get('/volunteers', adminController.getVolunteers)
router.get('/events', adminController.getEvents)

router.post('/add-volunteer', adminController.addVolunteer)
router.post('/add-event', adminController.addEvent)

router.delete('/delete-event/:eventId', adminController.deleteEvent) 
router.delete('/delete-volunteer/:userId', adminController.deleteVolunteer)

router.get('/:eventId', participantController.getEvent)
router.get('/user/:userId', adminController.getUser)

 router.patch('/edit-volunteer/:userId', adminController.editVolunteer)
//  router.patch('/edit-event/:eventId',adminController.editEvent)

module.exports = router
