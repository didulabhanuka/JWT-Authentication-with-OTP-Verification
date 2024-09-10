import mongoose from 'mongoose';

// Define the schema for User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  contactNumber: {
    type: String,
    required: true,
    match: [
      /^\d{10}$/,
      'Please enter a valid 10-digit phone number',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to automatically update the `updatedAt` field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Define the User model based on the schema
const User = mongoose.model('User', userSchema);

export default User;
