const express = require('express')
const router = express.Router({ mergeParams: true })
const Timestamp = require('../models/Timestamp')

//get all timestamps
router.get('/', async (req, res) => {
  try {
    const timestamps = await Timestamp.find()
    res.json(timestamps)
  } catch (err) {
    res.json({ message: err })
  }
})

//get timestamps with id
router.get('/:id', async (req, res) => {
  try {
    const timestamps = await Timestamp.find({ videoId: req.params.id })
    res.json(timestamps)
  } catch (err) {
    res.json({ message: err })
  }
})

//add timestamps
router.post('/', async (req, res) => {
  const timestamp = new Timestamp({
    videoId: req.body.videoId,
    text: req.body.text,
    time: req.body.time,
  })
  try {
    const savedTimestamp = await timestamp.save()
    res.json(savedTimestamp)
  } catch (err) {
    res.json({ message: err })
  }
})

//delete timestamp

router.delete('/:id', async (req, res) => {
  try {
    const timestamps = await Timestamp.deleteOne({ _id: req.params.id })
    res.json(timestamps)
  } catch (err) {
    res.json({ message: err })
  }
})

//delete all timestamps with id (when deleting video)
router.delete('/all/:id', async (req, res) => {
  try {
    const timestamps = await Timestamp.deleteMany({ videoId: req.params.id })
    res.json(timestamps)
  } catch (err) {
    res.json({ message: err })
  }
})
//export routes
module.exports = router
