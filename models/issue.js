const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var issue1 = new Schema({
    heading : String,
    content : String,
    date: Date,
    upvote :[],
    downvote : [],
});

const issue = mongoose.model('issue',issue1);

module.exports = issue;
