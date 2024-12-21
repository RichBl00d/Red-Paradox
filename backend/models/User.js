const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Used for password hashing
const jwt = require('jsonwebtoken'); // Used for generating JWT tokens

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare provided password with the stored hashed password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate a JWT token for the user
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, 'your_jwt_secret', {
    expiresIn: '1h', // Token expiration time
  });
  return token;
};

module.exports = mongoose.model('User', userSchema);
