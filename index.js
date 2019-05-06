const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const generatePassword = require('password-generator');
const profile = require('./api/profile/profile.router');
const item = require('./api/item/item.router');
const user = require('./api/user/user.router');
const venue = require('./api/venue/venue.router');
const recipe = require('./api/recipe/recipe.router');
const ingredient = require('./api/ingredient/ingredient.router');
const supplier = require('./api/supplier/supplier.router');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
console.log('About to connect to database...');
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;
  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  );
  // Return them as json
  res.json(passwords);
  console.log(`Sent ${count} passwords`);
});

app.use('/api/profile', profile);
app.use('/api/item', item);
app.use('/api/user', user);
app.use('/api/venue', venue);
app.use('/api/recipe', recipe);
app.use('/api/ingredient', ingredient);
app.use('/api/supplier', supplier);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
