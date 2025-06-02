const mongodb=require('mongodb')
const MongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectId

let database;

const getDatabase= async()=>{
   const client= await MongoClient.connect('mongodb://127.0.0.1:27017');
   database = client.db('library');
   if(!database){
    console.log("Database not Connected");
    
   }
   return database;
}
module.exports = {
    getDatabase,
    objectId
}