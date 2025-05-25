const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  title: { type: String, required: true }
});

userSchema.methods.GenerateHashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.ComparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.GenerateToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '100h' }
  );
  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;