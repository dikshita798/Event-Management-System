const express = require('express')

const volunteerController = require('../controllers/volunteer')

const router = express.Router

router.get('/participants', volunteerController.getParticipants)
router.get('/participate', volunteerController.participate)
router.get('/:event-id', volunteerController.getEvent)

router.post('/register/:event-id', volunteerController.registerEvent)