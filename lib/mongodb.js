import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Please add MONGODB_DB variable to .env.local");
}
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  // Connect to cluster
  let client = new MongoClient(uri, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb
  };
}
