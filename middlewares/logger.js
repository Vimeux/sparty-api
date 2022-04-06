// fonction appelé a chaque d'une route express
const loggerMiddleware = (req, res, next) => {
  if (req) {
    console.info(
      `[${new Date().toLocaleString()}] Requête ${req.method} reçue de ${req.url}`
    )
  }
  next()
}

module.exports = loggerMiddleware
