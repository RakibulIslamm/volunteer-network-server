const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvyuz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





const run = async () => {

    await client.connect();
    const database = client.db('Volunteer_Network');
    const categoryCollection = database.collection('categories');
    const volunteerCollection = database.collection('Volunteers');

    // Get Category API
    app.get('/categories', async (req, res) => {
        const cursor = categoryCollection.find({});
        const categories = await cursor.toArray();
        res.send(categories);
    });

    // get single category data API
    app.get('/register/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const category = await categoryCollection.findOne(query);
        res.send(category);
    })


    // Events Post API
    app.post('/register', async (req, res) => {
        const volunteer = req.body;
        const result = await volunteerCollection.insertOne(volunteer);
        // console.log(result);
        res.json(result);
    });

    // Get Volunteers API
    app.get('/volunteers', async (req, res) => {
        const cursor = volunteerCollection.find({});
        const volunteers = await cursor.toArray();
        res.send(volunteers);
    });

    // Delete volunteer
    app.delete('/volunteer/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await volunteerCollection.deleteOne(query);
        res.json(result);
    })



}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello from volunteer node server');
});

app.listen(port, () => {
    console.log('Running port is ', port);
})