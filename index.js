const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

// mongoDB connection

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ube8o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const booksCollection = client.db("bookStore").collection("books");
  const ordersCollection = client.db("bookStore").collection("orders");

  // post database
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    booksCollection.insertOne(newBook).then((result) => {
      console.log("Data insert", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // read or get database
  app.get("/books", (req, res) => {
    booksCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // to read product by keys
  app.get("/book/:id", (req, res) => {
    booksCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // order placed
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // read or get database
  app.get("/orders", (req, res) => {
    // console.log(req.query.email);
    ordersCollection.find({ email: req.query.email }).toArray((err, items) => {
      res.send(items);
    });
  });

  // delete
  app.delete("/deleteBook/:id", (req, res) => {
    booksCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  console.log("MongoDB connect successfully");
});

app.get("/", (req, res) => {
  res.send("Express Connect with MongoDB!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
