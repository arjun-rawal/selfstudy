import { MongoClient } from 'mongodb';

// const uri = 'process.env.MONGO_URI'; //for Mr. Sea, use 'mongodb://localhost:27017'
const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
