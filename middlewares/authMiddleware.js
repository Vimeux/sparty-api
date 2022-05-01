const jwt = require('jsonwebtoken')

// intercepeteur de validation d'authentification par jwt
const withAuth = (req, res, next) => {
  // on cherche le header authorization dans la requête
  if (req.headers.authorization) {
    console.log(req.headers.authorization)
    // on extrait le token car le format dans le header est 'bearer <token>'
    const token = req.headers.authorization.split(' ')[1]
    // on vérifie la présence du token
    if (!token) return res.status(401).send('Unauthorized: no authorization header')
    // on vérifie l'authenticité du token avec la phrase secrète
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.status(401).send('Unauthorized : invalid token')
      // vérification de l'expiration du token (optionel car jwt.verify le fait déjà)
      const now = new Date().getTime() / 1000
      // si l'expiration du token est inférieur à l'heure actuelle
      if (decoded.exp < now) return res.status(401).send('Unauthorized: Expired token')
      next()
    })
  } else {
    res.state(401).send('Unauthorized: No Token Provided')
  }
}

module.exports = withAuth
