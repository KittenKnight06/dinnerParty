const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({

  recipeId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  measure: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

module.exports = recipeSchema;
