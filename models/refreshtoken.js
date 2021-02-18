const mongodb = require('mongodb')
const jwt = require('jsonwebtoken')
const getDb = require('../utils/database').getDb

const secret =
  'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
class RefreshToken {
  constructor(userId, token, expires, id) {
    this.userId = userId
    this.token = token
    this.expires = expires
    this._id = id
  }

  static generateJwtToken(userId) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ id: userId }, secret, { expiresIn: '24h' })
  }

  saveRefreshToken() {
    // create a refresh token that expires in 7 days
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('refreshtokens')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      dbOp = db.collection('refreshtokens').insertOne(this)
    }
    return dbOp
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findByToken(token) {
    const db = getDb()
    return db
      .collection('refreshtokens')
      .find({ token: token })
      .next()
      .then((refreshtoken) => {
        //console.log(refreshtoken)
        return refreshtoken
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

module.exports = RefreshToken
