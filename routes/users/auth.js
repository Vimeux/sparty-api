const router = require('express').Router()
const client = require('../../db')

const bcryptjs = require('bcryptjs')
const { generateToken } = require('../../helpers/TokenHelpers')

router.route('/register')
  // POST (pour s'inscrire)
  .post(async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body
    try {
      const data = await client.query('SELECT * FROM "user" WHERE email = $1;', [email])
      const arr = data.rows
      if (arr.length > 0) {
        return res.status(400).json({
          error: 'Email already there, No need to register again.'
        })
      } else {
        // hash the password with 10 salt rounds
        bcryptjs.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(err).json({
              error: 'Server error'
            })
          }
          const user = {
            firstname,
            lastname,
            email,
            password: hash,
            phone
          }

          // Inserting data into the database

          client
            .query('INSERT INTO "user" (firstname, lastname, email, password, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *;', [user.firstname, user.lastname, user.email, user.password, user.phone], (err, result) => {
              if (err) {
                console.error(err)
                return res.status(500).json({
                  error: 'Database error'
                })
              } else {
                const _user = result.rows[0]
                // On supprime le mot de passe présent de l'objet (sécurité)
                delete _user.password
                // génération d'un token
                const payload = {
                  id: _user._id
                }
                generateToken(payload, (error, token) => {
                  if (error) return res.status(500).send('Error while generating token')
                  // on renvoie l'utilisateur créé et le token
                  return res.send({
                    message: 'User created',
                    _user,
                    token
                  })
                })
              }
            })
          // if (flag) {
          //   const token = jwt.sign( // Signing a jwt token
          //     {
          //       id: _user.id
          //     },
          //     process.env.JWT_SECRET
          //   )
          // }
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({
        error: 'Database error while registring user!' // Database connection error
      })
    };
  })

router.route('/login')
  // POST (pour se connecter)
  .post(async (req, res) => {
    const { email, password } = req.body
    try {
      const data = await client.query('SELECT * FROM "user" WHERE email = $1;', [email]) // Verifying if the user exists in the database
      const user = data.rows
      if (user.length === 0) {
        res.status(400).json({
          error: 'User is not registered, Sign Up first'
        })
      } else {
        bcryptjs.compare(password, user[0].password, (err, result) => { // Comparing the hashed password
          if (err) {
            res.status(500).json({
              error: 'Server error'
            })
          } else if (result === true) { // Checking if credentials match
            const payload = {
              id: user[0].id
            }
            generateToken(payload, (error, token) => {
              if (error) return res.status(500).send('Error while generating token')
              // on renvoie l'utilisateur créé et le token
              return res.send({
                message: 'User signed in!',
                token
              })
            })
            // const token = jwt.sign(
            //   {
            //     id: user[0].id
            //   },
            //   process.env.JWT_SECRET
            // )
            // res.status(200).json({
            //   message: 'User signed in!',
            //   token
            // })
          } else {
            // Declaring the errors
            if (result !== true) {
              res.status(400).json({
                error: 'Enter correct password!'
              })
            }
          }
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({
        error: 'Database error occurred while signing in!' // Database connection error
      })
    };
  })

module.exports = router
