const express = require('express')

const participantController = require('../controllers/participant')

const router = express.Router;

router.get('/:event-id', participantController.getEvent)

router.post('/register/:event-id', participantController.registerEvent)