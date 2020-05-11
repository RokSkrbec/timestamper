const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
require('dotenv/config')

//import routes
const videosRoute = require('./routes/videos')
const timestampsRoute = require('./routes/timestamps')

//middlewares
app.use(cors())
app.use(bodyParser.json())
app.use('/videos', videosRoute)
app.use('/timestamps', timestampsRoute)
app.use(express.static(path.join(__dirname, 'public')))

//home route
app.get('/', (req, res) => {
  res.send('Home')
})

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log('Connected to DB.')
    },
    (err) => {
      console.log({ message: err })
    }
  )
// start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})
