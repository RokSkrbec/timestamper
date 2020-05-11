const express = require('express')
const router = express.Router()
const Video = require('../models/Video')

//get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
    res.json(videos)
  } catch (err) {
    res.json({ message: err })
  }
})

//get one video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.find({ _id: req.params.id })
    res.json(video)
  } catch (err) {
    res.json({ message: err })
  }
})

//add video
router.post('/', async (req, res) => {
  const video = new Video({
    title: req.body.title,
    youtubeId: req.body.youtubeId,
    userId: req.body.userId,
    thumbnailUrl: req.body.thumbnailUrl,
  })
  try {
    const savedVideo = await video.save()
    res.json(savedVideo)
  } catch (err) {
    res.json({ message: err })
  }
})

//delete video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.deleteOne({ _id: req.params.id })
    res.json(video)
  } catch (err) {
    res.json({ message: err })
  }
})

//export routes
module.exports = router
