const mongoose = require('mongoose');

const dbConnection = async () => {
  console.log("dbConnection");
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
  } catch (err) {
    console.log(err);
    throw new Error('Error at starting data base');
  }
}

module.exports = {
  dbConnection
}