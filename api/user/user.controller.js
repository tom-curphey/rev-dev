const User = require('./user.model');
const Profile = require('../profile/profile.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../config/validation/register');
const validateLoginInput = require('../../config/validation/login');
const validateUserIngredientSupplierInput = require('../../config/validation/userIngredient');

const findAll = (req, res) => {
  User.find().then(users => {
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: 'No items found' });
    }
  });
};
module.exports.findAll = findAll;

// Assuming this is from a POST request and the body of the
// request contained the JSON of the new item to be saved
const addUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'A user with your email already exists';
      return res.status(400).json(errors);
    } else {
      Profile.findOne({ mobile: req.body.mobile }).then(mobile => {
        errors.mobile = 'A user with your mobile already exists';
        return res.status(400).json(errors);
      });

      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      console.log('newUser', newUser);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              if (!user) {
                errors.user =
                  'There was an error registering your account, please try and later..';
              }

              profileData = {};
              profileData.user = newUser._id;
              profileData.firstName = req.body.firstName;
              profileData.lastName = req.body.lastName;
              profileData.mobile = req.body.mobile;
              profileData.position = req.body.position;

              const newProfile = new Profile(profileData);
              newProfile.save().then(profile => {
                if (!profile) {
                  errors.profile =
                    'There was an error registering your account profile, please try and later..';
                }
                res.json({ user, profile });
              });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
};
module.exports.addUser = addUser;

const login = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email: email }).then(user => {
    errors.email = 'User not found';
    if (!user) {
      return res.status(404).json(errors);
    }

    console.log('Check User: ', user);

    // Check password
    bcrypt
      .compare(password, user.password)
      // Returns a boolean promise
      .then(isMatch => {
        if (!isMatch) {
          errors.password = 'Incorrect Password';
          return res.status(400).json(errors);
        }

        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          active: user.active,
          ingredients: user.ingredients
        };

        // Sign Token
        // 3600 is an hour in seconds
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 86400 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      });
  });
};
module.exports.login = login;

const currentUser = (req, res) => {
  console.log('Current User: ', req.user);

  // Create a custom return object
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    active: req.user.active,
    ingredients: req.user.ingredients
  });
};
module.exports.currentUser = currentUser;

const reactivateUser = (req, res) => {
  // Find the current user and reactivate them
  User.findOneAndUpdate(
    { _id: req.user.id },
    { active: true },
    { new: true }
  )
    .then(user => {
      console.log('reactivateUser: ', user);

      const payload = {
        id: user.id,
        name: user.name,
        active: user.active,
        ingredients: user.ingredients,
        iat: user.iat,
        exp: user.exp
      };
      res.status(200).json(payload);
    })
    .catch(err => res.status(404).json(err));
};
module.exports.reactivateUser = reactivateUser;

const addOrEditUserIngredient = (req, res) => {
  req.body.ingredient_id = req.params.ingredient_id;
  req.body.supplier_id = req.params.supplier_id;

  const { errors, isValid } = validateUserIngredientSupplierInput(
    req.body
  );

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findById(req.user.id).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(400).json(errors);
    }
    console.log('beforeUserIngredient: ', user);

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

      const userIngredientData = {};
      userIngredientData.ingredient = ingredient.id;
      userIngredientData.supplier =
        confirmedIngredientSupplier[0].supplier;
      userIngredientData.packageCost = req.body.packageCost;
      userIngredientData.packageGrams = req.body.packageGrams;

      const userIngredient = user.ingredients.filter(
        userIngredient => {
          return (
            userIngredient.ingredient.toString() === ingredient.id
          );
        }
      );

      if (userIngredient.length > 0) {
        userIngredient[0].set(userIngredientData);
      } else {
        user.ingredients.push(userIngredientData);
      }

      console.log('userIngredient: ', user);

      user
        .save()
        .then(userSaved => {
          if (!userSaved) {
            // errors.ingredient =
            // 'We could save the ingredient to your account';
            return res.status(400).json({
              message:
                'We could not save the ingredient to your account'
            });
          }
          // console.log('userSaved: ', userSaved);

          const updatedUser = {
            id: userSaved.id,
            name: userSaved.name,
            email: userSaved.email,
            active: userSaved.active,
            ingredients: userSaved.ingredients
          };

          return res.status(200).json(updatedUser);
        })
        .catch(err => {
          return res.status(400).json(err);
        });
    });
  });
};
module.exports.addOrEditUserIngredient = addOrEditUserIngredient;
