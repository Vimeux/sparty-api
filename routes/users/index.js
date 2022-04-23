const router = require('express').Router()
// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('../../db')
const { extractIdFromRequestAuthHeader } = require('../../helpers/TokenHelpers')
const withAuth = require('../../middlewares/authMiddleware')

router.route('/')
  // GET (Récupère et retourne un user par son id)
  .get(withAuth, (req, res) => {
    const id = extractIdFromRequestAuthHeader(req)

    db.query('SELECT firstname, lastname, email, phone, place_id, identity_card_id, payement_account_id FROM "user" where id = $1', [id], (err, result) => {
      if (err) return res.status(500).send({ message: 'invalids credentials' })
      res.send(result.rows[0])
    })
  })

  .delete(withAuth, (req, res) => {
    const id = extractIdFromRequestAuthHeader(req)

    db.query('DELETE FROM "user" where id = $1', [id], (err, result) => {
      if (err) return res.status(500).send({ message: 'invalids credentials' })
      res.send({ message: 'user has been deleted' })
    })
  })

module.exports = router
