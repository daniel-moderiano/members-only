const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a user. User messages will be reference in the message model rather than sotring an array of messages in the user model
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isMember: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true }
  } 
);

// Export the Schema as a mongoose model. A model instance can be considered an actual document to be saved/updated/deleted from a MongoDB collection
module.exports = mongoose.model('User', userSchema);