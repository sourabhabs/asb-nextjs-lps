import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

if (!dbName) {
  throw new Error("Missing required environment variable: MONGODB_DB");
}

declare global {
  var __asbMongoClientPromise__: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);
const clientPromise =
  global.__asbMongoClientPromise__ ?? client.connect();

if (!global.__asbMongoClientPromise__) {
  global.__asbMongoClientPromise__ = clientPromise;
}

export async function getMongoDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}
