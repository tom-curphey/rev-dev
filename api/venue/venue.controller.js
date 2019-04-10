const User = require('../user/user.model');
const Venue = require('./venue.model');

// Load Input Validation
const validateVenueInput = require('../../config/validation/venue');

const getVenue = (req, res) => {
  // To be complited
  const errors = {};
  // The bearer token functions place the user into req.user
  Venue.findOne({ user: req.user.id })
    .populate('user', ['name', 'email'])
    .then(venue => {
      if (!venue) {
        errors.novenue = 'There is no venue for this user';
        return res.status(404).json(errors);
      }
      return res.json(venue);
    })
    .catch(err => res.status(404).json(err));
};
module.exports.getVenue = getVenue;

const addOrEditVenue = (req, res) => {
  console.log('REQ', req.body);
  const { errors, isValid } = validateVenueInput(req.body);

  console.log('REQ - Errors', errors);
  // Check Validation
  if (!isValid) {
    // Return any errors
    return res.status(400).json(errors);
  }

  // Get Fields
  const venueFields = {};
  venueFields.user = req.user.id;
  if (req.body.name) {
    venueFields.displayName = req.body.name;
    venueFields.urlName = req.body.name
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  if (req.body.email) venueFields.email = req.body.email;
  if (req.body.phone) venueFields.phone = req.body.phone;
  if (req.body.website) venueFields.website = req.body.website;
  if (req.body.address) venueFields.address = req.body.address;

  // Costs
  venueFields.costs = {};
  if (req.body.chefPayPerHour)
    venueFields.costs.chefPayPerHour = req.body.chefPayPerHour;
  if (req.body.rentPerMonth)
    venueFields.costs.rentPerMonth = req.body.rentPerMonth;
  if (req.body.waterPerMonth)
    venueFields.costs.waterPerMonth = req.body.waterPerMonth;
  if (req.body.powerPerMonth)
    venueFields.costs.powerPerMonth = req.body.powerPerMonth;
  if (req.body.insurancePerYear)
    venueFields.costs.insurancePerYear = req.body.insurancePerYear;

  console.log(venueFields);

  Venue.findOne({
    user: req.user.id
  }).then(venue => {
    if (venue) {
      // Update
      Venue.findOneAndUpdate(
        { user: req.user.id },
        { $set: venueFields },
        { new: true }
      ).then(venue => {
        return res.json(venue);
      });
    } else {
      // Create Venue

      // Check if venue email exists
      Venue.findOne({
        urlName: venueFields.urlName
      })
        .then(venue => {
          // if (venue) {
          //   errors.venue = 'This Venue has already been registered';
          //   res.status(400).json(errors);
          // }

          // Save Venue
          new Venue(venueFields)
            .save()
            .then(venue => {
              return res.json(venue);
            })
            .catch(err => res.status(404).json(err));
        })
        .catch(err => res.status(404).json(err));
    }
  });
};
module.exports.addOrEditVenue = addOrEditVenue;

const venueByName = (req, res) => {
  const errors = {};

  // Venue.findOne({ name: req.params.venue_name })
  Venue.findOne({
    urlName: req.params.venue_name,
    user: req.user.id
  })
    .populate('user', ['name', 'avatar'])
    .then(venue => {
      if (!venue) {
        errors.novenue = "You don't have a Venue by this name..";
        res.status(404).json(errors);
      }

      res.status(200).json(venue);
    })
    .catch(err => res.status(404).json(err));
};
module.exports.venueByName = venueByName;

const venueByID = (req, res) => {
  const errors = {};

  Venue.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(venue => {
      if (!venue) {
        errors.novenue = 'There is no venue for this user';
        res.status(404).json(errors);
      }

      res.status(200).json(venue);
    })
    .catch(err => res.status(404).json(err));
};
module.exports.venueByID = venueByID;

const deleteUserAndVenue = (req, res) => {
  Venue.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndUpdate(
        { _id: req.user.id },
        { active: false },
        { new: true }
      )
        .then(() =>
          res.status(200).json({
            message: 'Your account has been successfully deactivated'
          })
        )
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json(err));
};
module.exports.deleteUserAndVenue = deleteUserAndVenue;
