const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express()
const port = 5000
//middlare
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5ucb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true

});
console.log(uri)

async function run() {
    try {
        await client.connect()
        const database = client.db('carmechanics')
        const servicecollection = database.collection('service')
        //get single service 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await servicecollection.findOne(query)
            res.json(service)
        })

        //GET API
        app.get('/service', async (req, res) => {
            const cursor = servicecollection.find({})
            const service = await cursor.toArray()
            res.send(service)
        })

        //POST API
        app.post('/service', async (req, res) => {
            const service = req.body

            console.log('post hitted', service)
            res.send('hitted post')

            const result = await servicecollection.insertOne(service)
            console.log(result)
            res.json(result)

        })



    }
    finally {
        // await client.close()

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    console.log('hello server')
    res.send('hello my mongodb server')
})
app.listen(port, () => {
    console.log("this is server", port)
})