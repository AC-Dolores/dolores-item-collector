/* eslint-disable */
const MongoClient = require('mongodb').MongoClient;
const config = require('../config.json');

const url = config.mongoUrl;

const saveDocToMongo = messages => new Promise((resolve, reject) => {
  MongoClient.connect(url, (error, db) => {
    if (error){
      reject({message:'failed to connect mongo', error: error});
    }else {
      const collection = db.collection('dolores');
      collection.insertMany(messages, (error, result) => {
        if (error) {
          reject({message:'failed to save mongo', error: error});
        } else {
          resolve(result);
        }
        db.close();
      });
    }
  });
});


module.exports = {
  saveDocToMongo
};
/* eslint-enable */
