const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a message written by a particular user. The link to a user is held as a reference in this model and not the User model
const MessageSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true  }
  } 
);

// Consider a virtual or other getter function related to timestamp to get it in the required format. Alternatively format as required in the EJS template

// Export the Schema as a mongoose model. A model instance can be considered an actual document to be saved/updated/deleted from a MongoDB collection
module.exports = mongoose.model('Message', MessageSchema);