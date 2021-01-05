const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const authRoutes = require('./routes/authRoute')
const mongooseConnection = require('./utils/db.config')
const authMiddleware = require('./middlewares/authMiddleware')
require('./utils/authStrategies/localStrategy')

const app = express()

app.locals.message = {}
app.locals.errors = {}
app.locals.formData = {}

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(session({
  secret: 'shh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // true works for https only
  store: new MongoStore({ mongooseConnection: mongooseConnection })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/', authRoutes)

app.get('/', (req, res) => {
  // console.log('user:', req.user)
  return res.render('index')
})

app.get('/homepage', authMiddleware, (req, res) => {
  res.send(`welcome ${req.user.name}`)
})

app.listen('3000', () => {
  console.log('Server is running at port 3000')
})

module.exports = app
