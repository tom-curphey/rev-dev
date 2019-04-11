const User = require('../user/user.model');
const Profile = require('../profile/profile.model');

const validateProfileInput = require('../../config/validation/profile');
const validateProfileIngredientSupplierInput = require('../../config/validation/profileIngredient');

const getProfile = (req, res) => {
  // To be complited
  const errors = {};
  // The bearer token functions place the user into req.user
  Profile.findOne({ user: req.user.id })
    // .populate('user', ['name', 'email'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no profile for this user';
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

const addOrEditProfileIngredient = (req, res) => {
  req.body.ingredient_id = req.params.ingredient_id;
  req.body.supplier_id = req.params.supplier_id;

  const { errors, isValid } = validateProfileIngredientSupplierInput(
    req.body
  );

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      errors.profile = 'Profile not found';
      return res.status(400).json(errors);
    }
    console.log('beforeProfileIngredient: ', profile);

    Ingredient.findById(req.body.ingredient_id).then(ingredient => {
      if (!ingredient) {
        errors.ingredient =
          'We could not find the ingredient selected';
        return res.status(404).json(errors);
      }

      const confirmedIngredientSupplier = ingredient.suppliers.filter(
        ingredientSupplier => {
          // console.log(
          //   'ingredientSupplier: ',
          //   ingredientSupplier.supplier
          // );
          // console.log('req: ', req.body.supplier_id);
          return (
            ingredientSupplier.supplier.toString() ===
            req.body.supplier_id
          );
        }
      );

      if (confirmedIngredientSupplier.length < 1) {
        errors.ingredient = `We could not find the supplier selected for ${
          ingredient.displayName
        }`;
        return res.status(404).json(errors);
      }

      const profileIngredientData = {};
      profileIngredientData.ingredient = ingredient.id;
      profileIngredientData.supplier =
        confirmedIngredientSupplier[0].supplier;
      profileIngredientData.packageCost = req.body.packageCost;
      profileIngredientData.packageGrams = req.body.packageGrams;

      const profileIngredient = profile.ingredients.filter(
        profileIngredient => {
          return (
            profileIngredient.ingredient.toString() === ingredient.id
          );
        }
      );

      if (profileIngredient.length > 0) {
        profileIngredient[0].set(profileIngredientData);
      } else {
        profile.ingredients.push(profileIngredientData);
      }

      // console.log('profileIngredient: ', profile);

      profile
        .save()
        .then(profileSaved => {
          if (!profileSaved) {
            const errors = {};
            errors.ingredient =
              'We could save the ingredient to your account';
            return res.status(400).json(errors);
          }
          // console.log('profileSaved: ', profileSaved);
          return res.status(200).json(profileSaved);
        })
        .catch(err => {
          return res.status(400).json(err.response.data);
        });
    });
  });
};
module.exports.addOrEditProfileIngredient = addOrEditProfileIngredient;
