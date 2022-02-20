#! /usr/bin/env node

console.log('This script populates test data in your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

const async = require('async')
const User = require('./models/user');
const Message = require('./models/message');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const users = []
const messages = []

// Create a user document, and save to the mongoDB collection 'users'
function userCreate(fullName, username, password, isMember, isAdmin, cb) {
  userDetail = { 
    fullName,
    username,
    password,
    isMember,
    isAdmin,
  }
  
  const user = new User(userDetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  });
}

// Create an message document, and save to the mongoDB collection 'messages'
function messageCreate(title, text, timestamp, author, cb) {
  messageDetail = { 
    title,
    text,
    timestamp,
    author,
  }    
    
  const message = new Message(messageDetail);   

  message.save(function (err) {
    if (err) {
      console.log(err);
      return
    }
    console.log('New Message: ' + message);
    messages.push(message);
    cb(null, message);
  });
}


function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate('Dan M', 'daniel@gmail.com', 'daniel12', true, false, callback);
    },
    function(callback) {
      userCreate('Sarah S', 'sarah@gmail.com', 'sarah12', true, true, callback);
    },
  ],
  // optional callback
  cb);
}

function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate('Hello', 'Hello people', new Date(), users[0], callback);
    },
    function(callback) {
      messageCreate('Hello', 'Hello from Sarah', new Date(), users[1], callback);
    },
  ],
  // optional callback
  cb);
}

async.series([
  createUsers,
  createMessages
],

// Optional callback
function(err, results) {
  if (err) {
    console.log('FINAL ERR: '+err);
  }
  else {
    console.log('Added data');
  }
  // All done, disconnect from database
  mongoose.connection.close();
});

