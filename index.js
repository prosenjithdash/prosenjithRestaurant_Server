const express = require('express');
const app = express();
const cors = require('cors'); require('dotenv').config()
const port = process.env.PORT || 2000;

//middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kybpity.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Get the database and collection on which to run the operation
    const menuColection = client.db("prosenjithRestaurant").collection("menu");
    const reviewColection = client.db("prosenjithRestaurant").collection("reviews");
    const cartColection = client.db("prosenjithRestaurant").collection("carts");

    
    //load menu data from DB
    app.get('/menu', async(req,res)=>{
        const result = await menuColection.find().toArray();
        res.send(result)
    })

    //load review data from DB
    app.get('/review', async(req,res)=>{
        const result = await reviewColection.find().toArray();
        res.send(result)
    })

    //carts collection
    // load all carts data from carts database
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await cartColection.find(query).toArray();
      res.send(result);
    })


    // create database for carts data 
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartColection.insertOne(cartItem);
        res.send(result)
    })

    //Delete
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartColection.deleteOne(query);
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('P R Open')
})

app.listen(port, ()=>{
    console.log(`P R is open on port ${port}`)
})