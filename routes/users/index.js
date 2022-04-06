const router = require('express').Router()
// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('../../db')

router.route('/')
  .get((req, res, next) => {
    db.query('SELECT * FROM "user"', (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result)
    })
  })

module.exports = router
