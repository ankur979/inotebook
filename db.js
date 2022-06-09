const { default: mongoose } = require("mongoose");
require('dotenv').config()

const mongoAtlasUri = process.env.NODE_ENV_MONGODB_URL;

// const mongoAtlasUri = 'mongodb://localhost:27017/inotebook'

    try {
        // Connect to the MongoDB cluster
        mongoose.connect(
          mongoAtlasUri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => console.log(" Mongoose is connected"),
        );
      } catch (e) {
        console.log("could not connect");
      }
      
      const dbConnection = mongoose.connection;
      dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
      dbConnection.once("open", () => console.log("Connected to DB!"))