const express = require('express')

const volunteerController = require('../controllers/volunteer')
const { getParticipants } = require('../controllers/admin')
const participantController = require('../controllers/participant')

const router = express.Router()

router.get('/participants', getParticipants)
router.get('/participate', volunteerController.participate)
router.get('/:eventId', participantController.getEvent)

router.post('/register/:eventId', participantController.registerEvent)

module.exports = router
