# node-express-starter
A starter project using node and express to build REST API's

You will need to create a config folder from the root folder and add a db.js file to config.
Inside db.js add this:
```js
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("MONGO_URI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
```
And this will allow you to connect to MongoDB instance you have set up.

Also in the config folder you will need to add a default.json file.
inside the file you need to add:
```js
{
  "MONGO_URI": "<your mongo instance connection string>",
  "JWT_SECRET": "<a random string of 128 length or more for security>"
}
```
This is needed to connect to mongodb and enable jsonwebtokens which is how this app does authentication.

If you wanted to use this and build an app on top of it these are the steps:
- Create a new mongoose Schema in the models folder.
- Create new routes for that Data Model in the routes/api/ folder.
- Import that new api file in server.js.
