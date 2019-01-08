const functions = require('firebase-functions')
const { db, documentIdFromHashOrUrl, collection, validateToken } = require('../utils')

module.exports = functions.https.onRequest((req, res) => {
  const url = String(req.query.url || '')
  const token = String(req.query.token || '')

  console.log('xxx', typeof token, token)

  if (!validateToken(token)) {
    return res.status(403).json({
      status: 403,
      error: 1,
      msg: 'token is invalid!'
    })
  }

  if (!url) {
    return res.status(400).json({
      status: 400,
      error: 1,
      msg: 'url is required!'
    })
  }

  const urlHash = documentIdFromHashOrUrl(url)
  db.collection(collection.URLS)
    .doc(urlHash)
    .delete()
    .then(snapshot => {
      return res.json(snapshot)
    }).catch(err => {
      return res.status(400).json(err)
    })
})
