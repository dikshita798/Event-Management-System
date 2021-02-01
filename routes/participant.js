const express = require('express')

const participantController = require('../controllers/participant')

const router = express.Router()

router.get('/:eventId', participantController.getEvent)

router.post('/register/:eventId', participantController.registerEvent)

module.exports = router