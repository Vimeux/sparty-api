const router = require('express').Router()
const client = require('../../db')
const multer = require('multer')
const { Pool } = require('pg')
const pool = new Pool()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/identityCards')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
    // path.extname get the uploaded file extension
  }
})
const upload = multer({ storage: storage })

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    // upload only png and jpg format
    return cb(new Error('Please upload a Image'))
  }
  cb(null, true)
}

const uplaodIdentity = upload.array('image', 2)

exports.upload = multer({
  storage: storage,
  fileFilter: multerFilter
})

router.route('/')
  // upload image
  .post(async (req, res) => {
    uplaodIdentity(req, res, async function (err) {
      if (err) return res.send({ error: 'invalid_file' })
      console.log(req.files, req.body)
      client.query('INSERT INTO "identity_card" (validation, recto_filename, recto_path, verso_filename, verso_path) VALUES ($1, $2, $3, $4, $5)', [true, req.files[0].filename, req.files[0].path, req.files[1].filename, req.files[1].path], (err, result) => {
        if (err) return res.send({ error: 'Database Error' })
      })
      // pool.connect((_err, client, done) => {
      //   const shouldAbort = err => {
      //     if (err) {
      //       console.error('Error in transaction', err.stack)
      //       client.query('ROLLBACK', err => {
      //         if (err) {
      //           console.error('Error rolling back client', err.stack)
      //         }
      //         // release the client back to the pool
      //         done()
      //       })
      //     }
      //     return !!err
      //   }
      //   client.query('BEGIN', err => {
      //     if (shouldAbort(err)) return
      //     const queryText = 'INSERT INTO "identity_card" (validation, recto_filename, recto_path, verso_filename, verso_path) VALUES ($1, $2, $3, $4, $5) RETURNING id'
      //     client.query(queryText, [false, req.files[0].filename, req.files[0].path, req.files[1].filename, req.files[1].path], (err, res) => {
      //       if (shouldAbort(err)) return
      //       const insertIdentityIdText = 'UPDATE "user" SET identity_card_id = $1 WHERE id = $2'
      //       const insertIdentityIdValues = [res.rows[0].id, req.body.userId]
      //       client.query(insertIdentityIdText, insertIdentityIdValues, (err, res) => {
      //         if (shouldAbort(err)) return
      //         client.query('COMMIT', err => {
      //           if (err) {
      //             console.error('Error committing transaction', err.stack)
      //           }
      //           done()
      //         })
      //       })
      //     })
      //   })
      // })
      res.status(200).send('file uploaded')
    })
  })

module.exports = router
