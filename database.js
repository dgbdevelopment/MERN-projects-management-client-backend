const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("Error in Database connection");
      return process.exit(1);
    }
    console.log("Database is connected");
  }
);
