const mongodb = require('mongodb')

const getDb = require('../utils/database').getDb

class Event {
  constructor(name, startdate, enddate, organizer, description, id) {
    this.name = name
    this.startdate = startdate
    this.enddate = enddate
    this.organizer = organizer
    this.description = description
    this._id = id
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('events')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      dbOp = db.collection('events').insertOne(this)
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
      .collection('events')
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then((event) => {
        return event
      })
      .catch((err) => {
        console.log(err)
      })
  }
  static fetchAll() {
    const db = getDb()
    return db
      .collection('events')
      .find()
      .toArray()
      .then((events) => {
        return events
      })
      .catch((err) => {
        console.log(err)
      })
  }
  static deleteById(id) {
    const db = getDb()
    return db
      .collection('events')
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .then((result) => {
        //console.log(result)
        console.log('Deleted!')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
module.exports = Event
