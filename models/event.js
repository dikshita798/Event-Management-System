const mongodb = require("mongodb");

const getDb = require("../utils/database").getDb;

class Event {
    constructor(name, startdate, enddate, organizer, description) {
        this.name = name;
        this.startdate = startdate
        this.enddate = enddate
        this.organizer = organizer
        this.description = description
    }

    save() {
        const db = getDb();
        return db.collection('events').insertOne(this)
        .then(result => {
            //console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('events').find({_id: new mongodb.ObjectID(id)}).next()
        .then(event => {
            return event;
        })
        .catch(err => {
            console.log(err);
        });
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('events').find().toArray()
        .then(events => {
            return events;
        })
        .catch(err => {
            console.log(err);
        });
    }
}
module.exports = Event