const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  name: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    }
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  }
});

recruiterSchema.statics.GeneratePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

recruiterSchema.methods.ComparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

recruiterSchema.methods.GenerateToken = async () => {
  const Token = jwt.sign({_id: this._id, email: this.email},
    process.env.JWT_SECRET,
    { expiresIn: '100h' }
  );

  return Token;
}

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;