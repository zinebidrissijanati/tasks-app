const db = use('MongoDB');

const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true },
  ref: {
    type: String, required: true, unique: true, index: true,
  },
  profile: {
    role: {
      type: String,
      enum: ['admin', 'user_1', 'user_2'],
      required: true,
    },
  },
  createdBy: {
    type: String, required: true,
  },
  createdAt: { type: Date, required: true },
});

const Users = db.model('Users', userSchema);

module.exports = Users;