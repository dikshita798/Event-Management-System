const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth')

router.post('/register/volunteer', authControllers.registerVolunteer)

router.post('/register/participant', authControllers.registerParticipant)
router.post('/refreshtoken', authControllers.refreshtoken)
module.exports = router
