const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

console.log("Server Running")
// Connection URL
const url = 'mongodb+srv://dbWillUser:75mEpSj0UQYkcSZX@allairedata.c3y6p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


//const db = client.db("");
//var cursor = url.collection('test3').find({FeatureCollection});
//console.log(cursor);
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
    if (err) return console.error(err)
    console.log('Connected to Database')
    assert.equal(null, err);
    client.close();
}).then(client => {

    const db = client.db('myFirstDatabase')
    app.use()
    app.get()
    app.post()
    app.listen()
}).catch(console.error);