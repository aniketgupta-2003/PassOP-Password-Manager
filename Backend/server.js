const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");

dotenv.config();

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "passop";

const app = express();
const port = 3000;

app.use(bodyparser.json());
//cors fixing
app.use(cors())

client.connect();

// Get all the passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

// Save a password
app.post("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.insertOne(password);
  res.send({ success: true, result: findResult});
});

// Delete a password
app.delete("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.deleteOne(password);
  res.send({ success: true, result: findResult});
});


 // Update a password
app.put("/", async (req, res) => {
  const password = req.body;

  const db = client.db(dbName);
  const collection = db.collection("passwords");

  const result = await collection.updateOne(
    { id: password.id },
    {
      $set: {
        site: password.site,
        username: password.username,
        password: password.password
      }
    }
  );

  res.send({
    success: true,
    result: "Updated Successfully",
    modifiedCount: result.modifiedCount
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
