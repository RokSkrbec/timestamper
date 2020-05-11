const mongoose = require('mongoose')

const VideoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  youtubeId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
})

module.exports = mongoose.model('Videos', VideoSchema)
