const config = require("../config");
require('dotenv').config()
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};


if(process.env.NODE_ENV === 'test'){
  var MockMongoose = require('mock-mongoose').MockMongoose;
  var mockMongoose = new MockMongoose(mongoose);
   
  mockMongoose.prepareStorage().then(function() {
    mongoose.connect(
      process.env.MONGODB_URI || config.connectionString,
      connectionOptions
    );	
  });
} else {
  mongoose.connect(
    process.env.MONGODB_URI || config.connectionString,
    connectionOptions
  );
}

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/UserModel"),
  Recipes: require("../recipe/RecipeModel"),
};
