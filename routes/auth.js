const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth')

router.post('/register/volunteer', authControllers.registerVolunteer)
router.post('/login/volunteer', authControllers.loginVolunteer)
router.post('/logout/volunteer', authControllers.logoutVolunteer)

router.post('/register/participant', authControllers.registerParticipant)
router.post('/login/participant', authControllers.loginParticipant)
router.post('/logout/participant', authControllers.logoutParticipant)

module.exports = router
