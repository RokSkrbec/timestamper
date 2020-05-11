const mongoose = require('mongoose')

const timestampSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  videoId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    //required: true,
  },
  time: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Timestamps', timestampSchema)
