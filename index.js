const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const e = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nfyjflh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("gearUP").collection("categories");
    const serviceCollection = client.db("gearUP").collection("services");
    const productCollection = client.db("gearUP").collection("products");
    const userCollection = client.db("gearUP").collection("usersInfo");
    // const bookingsCollection = client.db("gearUP").collection("bookings");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.userType === 'admin' });
  })



  app.get("/users/seller/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email }
    const user = await userCollection.findOne(query);
    res.send({ isSeller: user?.userType === 'seller' });
  });
    
    app.post("/users", async (req, res) => {
      const user = req.body;
      const cursor = userCollection.find({email:user.email});
      const isUserExist = await cursor.toArray();
      if( !isUserExist.length ){
        const result = await userCollection.insertOne(user);
        res.send(user);
      }
        return;
    });

    // delete

  //   app.delete('/users/:id', async (req, res) => {
  //     const id = req.params.id;
  //     // console.log('trying to delete', id);
  //     const query = { _id: ObjectId(id) }
  //     const result = await userCollection.deleteOne(query);
  //     console.log(result);
  //     res.send(result);
  // });

    

    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };

      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.post("/category/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/category/products/:sellerEmail", async (req, res) => {
      const sellerEmail = req.params.sellerEmail;
      const query = { seller_email: sellerEmail };
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

    // app.get("/bookings", async (req, res) => {
    //     const email = req.query.email;
    //     const query = { email: email };
    //     const bookings = await bookingsCollection.find(query).toArray();

    //     res.send(bookings);
    // });

    // app.post("/bookings", async (req, res) => {
    //     const booking = req.body;
    //     console.log(booking);
    //     const result = await bookingsCollection.insertOne(booking);
    //     res.send(result);
    // });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Used Product Resale server is running");
});

app.listen(port, () => {
  console.log(`Used Product Resale Server running on port: ${port}`);
});
