const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// medillwares It has to do with allowing other domains to make requests against web API.
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.POWERRANK_CLIENT}:${process.env.POWERRANK_PASSWORD}@cluster0.kbyx5ha.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {
    const billCollection = client.db('powerhack').collection('bills');



    app.get('/billing-list', async (req, res) => {
      const query = {};
      const cursor = billCollection.find(query);
      const product = await cursor.toArray()
      res.send(product)
    })

    app.post('/add-billing', async (req, res) => {
      const bill = req.body;
      const result = await billCollection.insertOne(bill);
      res.send(result)
    })


    app.delete("/delete-billing/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const deleteBill = await billCollection.deleteOne(query);
      if (deleteBill?.deletedCount) {
        res.send(deleteBill);
      }
    })


  }
  finally {

  }

}
run().catch(error => console.log(error))




// Just for testing perpous
app.get('/', (req, res) => {
  res.send('server runing')
})

app.listen(port, () => {
  console.log(`runing on ${port}`)
})