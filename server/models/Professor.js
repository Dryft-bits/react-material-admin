const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Professor = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  hash: {
      type: String, 
      required: true
  },
  department: {
      type: String,
      required: true
  },
  email:  {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("professor", Professor);