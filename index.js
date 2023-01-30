const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// medillwares

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('server runing')
})

app.listen(port, () => {
  console.log(`runing on ${port}`)
})