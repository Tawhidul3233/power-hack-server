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
    // create bills collection
    const billCollection = client.db('powerhack').collection('bills');
    // create user collection
    const usersCollection = client.db('powerhack').collection('users');

// get all billing list api
    app.get('/api/billing-list', async (req, res) => {
      const query = {};
      const cursor = billCollection.find(query);
      const product = await cursor.toArray()
      res.send(product)
    })


    // user collection api
    app.post('/api/registration', async(req, res)=>{
      const user = req.body;
      const query = {email: user.email};
      const cursor = await usersCollection.findOne(query);
      if(cursor) return ;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    // api to add new billing and billing id create server respons success in the list
    app.post('/api/add-billing', async (req, res) => {
      const bill = req.body;
      const billingId = Math.floor(Math.random() * 1000000000);
      bill.billingId = billingId;
      const result = await billCollection.insertOne(bill);
      res.send(result)
    })

    // update bill information api
    app.put('/api/update-billing/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const option = {upsert: true}
      const bill = req.body;
      const updateBill = {
        $set : {
          name: bill.name,
          email: bill.email,
          amount: bill.amount,
          phone: bill.phone
        }
      }
      const result = await billCollection.updateOne(filter, updateBill, option)
      res.send(result)
    })


    // api to delete any bill in the billing list
    app.delete("/api/delete-billing/:id", async (req, res) => {
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