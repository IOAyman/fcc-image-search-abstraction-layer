const router = require('express').Router()


router.all('/', (req, res, next) => {
  res.json({ message: 'not implemented'})
})


// Woops!
router.use((error, req, res, next) => res.json({ error }))


module.exports = router
