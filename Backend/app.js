require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const UserRoutes = require('./Routes/user');
const RecruiterRoutes = require('./Routes/recruiter');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', UserRoutes);
app.use('/recruiter', RecruiterRoutes);

module.exports = app;