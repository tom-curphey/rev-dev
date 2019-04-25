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
  console.log('req.body ====+++ ', req.body);

  req.body.ingredient_id = req.params.ingredient_id;
  req.body.supplier_id = req.params.supplier_id;
  const { errors, isValid } = validateProfileIngredientSupplierInput(
    req.body
  );
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Find profile by ID
  Profile.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      errors.profile = 'Profile not found';
      return res.status(400).json(errors);
    }
    // Find ingredient by ID
    Ingredient.findById(req.body.ingredient_id).then(ingredient => {
      if (!ingredient) {
        errors.ingredient =
          'We could not find the ingredient selected';
        return res.status(404).json(errors);
      }
      // Check if supplier ID is in ingredient suppliers
      const confirmedIngredientSupplier = ingredient.suppliers.filter(
        ingredientSupplier => {
          return (
            ingredientSupplier.supplier.toString() ===
            req.body.supplier_id
          );
        }
      );
      // Return error if supplier ID did not match ingredient suppliers
      if (confirmedIngredientSupplier.length < 1) {
        errors.ingredient = `We could not find the supplier selected for ${
          ingredient.displayName
        }`;
        return res.status(404).json(errors);
      }
      // Check if ingredient is already in profile ingredients return profile ingredient
      const profileIngredient = profile.ingredients.filter(
        profileIngredient => {
          return (
            profileIngredient.ingredient.toString() === ingredient.id
          );
        }
      );
      console.log(
        '------->profileIngredient[0].suppliers: ',
        profileIngredient[0].suppliers
      );

      // if (profileIngredient.length > 0) {
      //   // if (req.body.prefered === true) {
      //   const newProfileIngredient = profileIngredient[0].suppliers.map(
      //     profileIngredientSupplier => {
      //       profileIngredientSupplier.prefered = false;
      //       return profileIngredientSupplier;
      //     }
      //   );
      //   // }

      //   console.log('newProfileIngredient: ', newProfileIngredient);
      // }

      // console.log(
      //   '----^^--->profileIngredient.suppliers: ',
      //   profileIngredient.suppliers
      // );

      if (profileIngredient.length > 0) {
        let setProfileIngredientSuppliersToFalse = null;
        if (req.body.prefered === true) {
          setProfileIngredientSuppliersToFalse = profileIngredient[0].suppliers.map(
            profileIngredientSupplier => {
              profileIngredientSupplier.prefered = false;
              return profileIngredientSupplier;
            }
          );
        }

        if (setProfileIngredientSuppliersToFalse !== null) {
          profileIngredient.suppliers = setProfileIngredientSuppliersToFalse;
        }

        // console.log(
        //   '----^^--->updatedProfileIngredient: ',
        //   updatedProfileIngredient[0]
        // );

        console.log('YOU NEED TO EDIT THE INGREDIENT SUPPLIERS');
        let supplierIndex = null;
        const profileIngredientSupplierIndex = profileIngredient[0].suppliers.findIndex(
          profileIngredientSupplier => {
            return (
              profileIngredientSupplier.supplier.toString() ===
              confirmedIngredientSupplier[0].supplier.toString()
            );
          }
        );

        console.log(
          '--profileIngredientSupplierIndex: ',
          profileIngredientSupplierIndex
        );

        if (profileIngredientSupplierIndex === -1) {
          console.log('YOU NEED TO ADD THE INGREDIENT SUPPLIER');
          const newProfileIngredientSupplier = {};
          newProfileIngredientSupplier.supplier =
            confirmedIngredientSupplier[0].supplier;
          newProfileIngredientSupplier.packageCost =
            req.body.packageCost;
          newProfileIngredientSupplier.packageGrams =
            req.body.packageGrams;
          newProfileIngredientSupplier.prefered = req.body.prefered
            ? req.body.prefered
            : false;
          profileIngredient[0].suppliers.push(
            newProfileIngredientSupplier
          );
        } else {
          console.log('YOU NEED TO EDIT THE INGREDIENT SUPPLIER');
          const updatedProfileIngredientSupplier = {};
          updatedProfileIngredientSupplier.packageCost =
            req.body.packageCost;
          updatedProfileIngredientSupplier.packageGrams =
            req.body.packageGrams;
          updatedProfileIngredientSupplier.prefered = req.body
            .prefered
            ? req.body.prefered
            : false;

          console.log(
            'updatedProfileIngredientSupplier: ',
            updatedProfileIngredientSupplier
          );
          // console.log('req.body: ', req.body.prefered);

          profileIngredient[0].suppliers[
            profileIngredientSupplierIndex
          ].set(updatedProfileIngredientSupplier);
        }
      } else {
        console.log('YOU NEED TO ADD THE INGREDIENT & SUPPLIER');

        const newProfileIngredient = {};
        newProfileIngredient.ingredient = ingredient._id;
        newProfileIngredient.suppliers = {};
        newProfileIngredient.suppliers.supplier =
          confirmedIngredientSupplier[0].supplier;
        newProfileIngredient.suppliers.packageCost =
          req.body.packageCost;
        newProfileIngredient.suppliers.packageGrams =
          req.body.packageGrams;
        newProfileIngredient.suppliers.prefered = req.body.prefered
          ? req.body.prefered
          : false;

        profile.ingredients.push(newProfileIngredient);
      }

      console.log('>>----->>-----profileIngredient: ', profile);

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
          return res.status(400).json(err);
        });
    });
  });
};
module.exports.addOrEditProfileIngredient = addOrEditProfileIngredient;
