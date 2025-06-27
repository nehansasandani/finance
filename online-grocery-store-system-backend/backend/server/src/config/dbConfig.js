require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false); // Add this line to avoid deprecation warnings

const dbConnect = async () => {
   try {
       await mongoose.connect(process.env.MONGO_URL);

       console.log(`Connected to MongoDB Successfully!`);
   } catch (error) {
       console.error(`Error: ${error.message}`);
       return; // Add this line to ensure the function exits on error
   }
};

module.exports = dbConnect;