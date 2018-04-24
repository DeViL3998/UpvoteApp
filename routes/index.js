var express = require('express');
var router = express.Router();
var http = require('http');
var path = require('path');
var url = require('url');
var users = require('../models/users');
var issue = require('../models/issue');


var heading = require('../models/issue').heading;
var content = require('../models/issue').content;
var upvote = require('../models/issue').upvote;
var downvote = require('../models/issue').downvote;


var mongoose = require('mongoose');

var userName;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function auth(req, res, next){
  if(req.session && 'username' in req.session){
    next();
  }
  else {
    res.send('You are not authorized! ... Please login again to view this page');
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/signup', function(req,res) {
  res.sendFile(path.join(__dirname, '../public/signup.html'))
});


router.post('/signup', function(req,res,next) {
  var newUser = new users({
    username : req.body.username,
    password : req.body.password,
    email : req.body.password,
    phone : req.body.phone,
    firstname : req.body.firstname,
    lastname : req.body.lastname
  });
  newUser.save(function(err,user) {
    if(err){
      res.send(err);
    } else {
      res.redirect('/login');
    }
  });
});


router.get('/login', function(eq,res,next) {
  res.sendFile(path.join(__dirname,'../public/login.html'))
});

router.post('/login', function(req,res,next) {
/*
users.findOneu\({username : req,body.username},function(err, user) {

  if(err){

    res.send(err);
  }
  else if(user.password === req.body.password) {

    console.log(req.body.password);
    console.log(user.password);
    res.send("Welcome" + req.body.username);
  }
  else{

    res.send("you are not authorised!");
  }
});

*/
  var query = users.findOne({ username : req.body.username });

  query.select('password');

  query.exec( function(err, user) {

    if(err){

      res.send(err);
    }
    else if(user.password === req.body.password) {

      req.session.username = req.body.username;
      userName = req.body.username;
      res.redirect('/create');
    }
    else{
      res.redirect('/login?msg='+'Wrong Username/Password');
    }
  });
});


router.get('/profile', auth, function(req,res,next) {
  res.send('Welcome! See magic happen!' + req.session.username );
});

router.get('/logout', function(req, res, next) {
  delete req.session.username;
  res.send('succesfully logged out ! ! !')
});

// router.get('/issue', auth, function(req, res, next) {
//   res.render("index",issue);
// });
//
// router.post('/issue', function(req, res, next) {
//   console.log(req.body.heading);
//   console.log(req.body.detail);
//
// });

router.get('/create',auth,function(req, res, next) {
  users.findOne({username : req.session.username}, function(err,user) {
    if(err){
      console.log(err);
    } else{
      console.log(user);
      res.render('create',user);
   }
 });
});

router.post('/create',auth,function(req, res, next) {
  var newIssue = new issue({
    heading : req.body.heading,
    content : req.body.detail,
    date : new Date() ,
    upvote : [],
    downvote : []
  });
  newIssue.save(function(err,issue) {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.redirect('/home');
    }
  });
});

router.get('/home',auth,function(req,res,next) {
  issue.find({},function(err,issues) {
    if(err){
      res.send(err);
    } else {
      res.render('home',{issues : issues});
    }
  });
});

router.get('/upvote/:id',auth, function(req, res, next) {
  var issueId = req.params.id;

  var userId = req.session.username;

  issue.findByIdAndUpdate( issueId, {$push : {upvote : userId}},  function(err, issue) {
    if(err){
      console.log(err);
    }else {
      console.log(issue);
      res.send(issue.upvote.length);
    }
  });

  users.findOneAndUpdate({username: userId}, {$push:{issueUp : issueId}},(issue.upvote.Contains(userId))&&(issue.downvote.Contains(userId)), function (err,updatedUser) {
    if(err){
      res.send(err);
      console.log(err);
    } else {
    console.log("issue has been pushed in db.users");
    console.log(updatedUser);
    }
  });
  res.redirect('/home')
});


router.get('/downvote/:id',auth, function(req, res, next) {
  var issueId = req.params.id;

  var userId = req.session.username;

  issue.findByIdAndUpdate( issueId, {$push : {downvote : userId}},  function(err, issue) {
    if(err){
      console.log(err);
    }else {
      console.log(issue);
      res.send(issue.upvote.length);
    }
  });

  users.findOneAndUpdate({username: userId}, {$push:{issueDown : issueId}}, function (err,updatedUser) {
    if(err){
      res.send(err);
      console.log(err);
    } else {
    console.log("issue has been pushed in db.users");
    console.log(updatedUser);
    }
  });
  res.redirect('/home');
});

module.exports = router;
