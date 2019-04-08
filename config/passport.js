const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../api/user/user.model');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
      // The jwt_payload is an object thats why it doesn't need {} around it
      User.findById(jwt_payload.id)
        .then(user => {
          if (!user) {
            // return res
            //   .status(400)
            //   .json({ message: 'There are no current users' });
            return done(null, false);
          }
          return done(null, user);
        })
        .catch(err => console.log(err));
    })
  );
};
