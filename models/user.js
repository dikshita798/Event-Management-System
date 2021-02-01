const mongodb = require('mongodb')

const getDb = require('../utils/database').getDb

class User {
  constructor(name, email, password, type, events, id) {
    this.name = name
    this.email = email
    this.password = password
    this.type = type
    this.events = events
    this._id = id
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('users')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      dbOp = db.collection('users').insertOne(this)
    }

    return dbOp
      .then((result) => {
        //console.log(result);
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findById(id) {
    const db = getDb()
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then((user) => {
        //console.log(user);
        return user
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findByType(type) {
    const db = getDb()
    return db
      .collection('users')
      .find({ type: type })
      .toArray()
      .then((users) => {
        //console.log(user);
        return users
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
module.exports = User
