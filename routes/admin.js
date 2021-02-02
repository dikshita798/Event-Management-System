const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/participants', adminController.getParticipants)
router.get('/volunteers', adminController.getVolunteers)
router.get('/events', adminController.getEvents)

router.post('/add-volunteer', adminController.addVolunteer)
router.post('/add-event', adminController.addEvent)

module.exports = router
