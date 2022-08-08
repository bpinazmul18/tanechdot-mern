const mongoose = require('mongoose');
require('dotenv').config();

module.exports = connect = async () => {
    try {
        const url = await mongoose.connect(process.env.URL, {
            useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
        });
        console.log("Connection created!")
    } catch (error) {
        console.log(error);
    }
}


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.qxj4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
