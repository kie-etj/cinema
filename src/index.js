const path = require('path')
const express = require('express')
const { engine } = require ('express-handlebars')
const cookieParser = require('cookie-parser')
// const session = require('express-session')

const route = require('./routes')
const db = require('./db')

// Connect to DB
// db.connect()

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'assets')))

app.use(cookieParser())

// app.set('trust proxy', 1)
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
    }
  }))

app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'views'))
console.log(path.join(__dirname, 'views'))

route(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})