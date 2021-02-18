require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const volunteerRoutes = require('./routes/volunteer')
const participantRoutes = require('./routes/participant')
const { authenticateJWT } = require('./controllers/auth')
const { mongoConnect } = require('./utils/database')

const app = express()
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    )
  },
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)

app.use(authRoutes)
app.use('/admin', authenticateJWT, adminRoutes)
app.use('/volunteer', authenticateJWT, volunteerRoutes)
app.use('/participant', authenticateJWT, participantRoutes)

mongoConnect(() => {
  app.listen(3000)
})
