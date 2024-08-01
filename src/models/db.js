const mongoose = require('mongoose');
const Review = require('./Review');
const Restaurant = require('./Restaurant');
const User = require('./User');

const { MongoClient } = require('mongodb'); 

function connect() {
    mongoose.connect(process.env.MONGODB_URI);
    mongoose.model('Review', Review.schema);
    mongoose.model('Restaurant', Restaurant.schema);
    mongoose.model('User', User.schema);
}

async function checkDatabase() {
  const uri = 'mongodb://0.0.0.0:27017/';
  const databaseName = 'thescoop'
  
  try {

    // Use MongoClient to list databases
    const client = new MongoClient(uri);
    await client.connect();

    const adminDb = client.db().admin();
    const databasesList = await adminDb.listDatabases();

    // Check if the specified database exists
    const dbExists = databasesList.databases.some(db => db.name === databaseName);

    // console.log(dbExists);
    // Close the connections
    await client.close();
    
    return dbExists;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function disconnect(){
    await mongoose.connection.close();
}


module.exports = {connect, checkDatabase, disconnect};