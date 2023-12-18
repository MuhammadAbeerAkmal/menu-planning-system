const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  recipeName: { type: String, unique: true, required: true },
  recipeDescription: { type: String },
  recipeServings: { type: String },
  prepTime: { type: String },
  cookTime: { type: String },
  totalCookTime: { type: String },
  difficultyLevel: { type: String },
  userId: { type: String },
  userName: { type: String },
  ingredients: { type: Array },
  recipeSteps: { type: Array },
  images: { type: Array },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model("Recipes", schema);
