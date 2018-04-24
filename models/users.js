const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  username : String,
  firstname : String,
  lastname : String,
  password : String,
  email : String,
  phone : Number,
  issuesCreated : [],
  issuesDown:[] ,
  issueUp:[]
});

const users = mongoose.model('users',schema);

module.exports = users
