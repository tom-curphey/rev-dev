const User = require('../user/user.model');
const Profile = require('../profile/profile.model');

const validateProfileInput = require('../../config/validation/profile');

const getProfile = (req, res) => {
  // To be complited
  const errors = {};
  // The bearer token functions place the user into req.user
  Profile.findOne({ user: req.user.id })
    // .populate('user', ['name', 'email'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};
module.exports.getProfile = getProfile;

const editProfile = (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors
    return res.status(400).json(errors);
  }

  const profileData = {};
  profileData.user = req.user.id;
  if (req.body.firstName) profileData.firstName = req.body.firstName;
  if (req.body.lastName) profileData.lastName = req.body.lastName;
  if (req.body.mobile) profileData.mobile = req.body.mobile;
  if (req.body.position) profileData.position = req.body.position;

  console.log('profileData: ', profileData);

  Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileData },
    { new: true }
  ).then(profile => {
    if (!profile) {
      errors.profile =
        'There was an error saving your profile, we will inform you by email once we have resolved the issue';
      return res.status(401).json(errors);
    }

    return res.json({ message: 'Success', profile });
  });
};

module.exports.editProfile = editProfile;

const deactivateProfile = (req, res) => {
  Profile.findOneAndUpdate(
    { user: user.req.id },
    { active: false },
    { new: true }
  ).then(profile => {
    if (!profile) {
      errors.profile =
        'There was an error saving your profile, we will inform you by email once we have resolved the issue';
      return res.status(401).json(errors);
    }

    return res.json({ message: 'Success', profile });
  });
};
module.exports.deactivateProfile = deactivateProfile;
