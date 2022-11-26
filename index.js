const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nfyjflh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        
        const categoryCollection = client.db("gearUP").collection("categories");
        const serviceCollection = client.db("gearUP").collection("services");
        const productCollection = client.db("gearUP").collection("products");

        app.get("/categories", async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;
            const query = { category_id : id };

            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
  
    } 
  
    finally {
  
    }
  }
  
  run().catch((err) => console.error(err));



app.get('/', (req, res) => {
    res.send("Used Product Resale server is running")
})

app.listen(port, () => {
    console.log(`Used Product Resale Server running on port: ${port}`)
})