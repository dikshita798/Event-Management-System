const express = require('express')

const participantController = require('../controllers/participant')

const router = express.Router()

router.get('/:eventId', participantController.getEvent)

router.post('/login', participantController.loginParticipant)
router.post('/logout', participantController.logoutParticipant)
router.post('/register/:eventId', participantController.registerEvent)

module.exports = router
