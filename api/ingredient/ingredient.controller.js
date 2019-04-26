const Ingredient = require('./ingredient.model');
const Supplier = require('../supplier/supplier.model');
const Profile = require('../profile/profile.model');

// Load Input Validation
const validateIngredientInput = require('../../config/validation/ingredient');
const validateIngredientSupplierInput = require('../../config/validation/ingredientSupplier');

const getAllIngredients = (req, res) => {
  Ingredient.find()
    // .populate('user', ['name', 'email'])
    .populate('suppliers.supplier', ['displayName'])
    .then(ingredients => {
      if (!ingredients) {
        return res.status(404).json({
          message:
            "There aren't any ingredients registered in the database"
        });
      }

      return res.status(200).json(ingredients);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
module.exports.getAllIngredients = getAllIngredients;

const getIngredientByName = (req, res) => {
  Ingredient.findOne({ urlName: req.params.ingredient_name })
    .populate('supplier')
    .then(ingredient => {
      if (!ingredient) {
        return res.status(404).json({
          message: "There isn't an ingredient registered by this name"
        });
      }

      return res.status(200).json(ingredient);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
module.exports.getIngredientByName = getIngredientByName;

const getIngredientByID = (req, res) => {
  Ingredient.findById(req.params.ingredient_id)
    .then(ingredient => {
      if (!ingredient) {
        return res.status(404).json({
          message: "There isn't an ingredient registered by this name"
        });
      }
      return res.status(200).json(ingredient);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
module.exports.getIngredientByID = getIngredientByID;

const addIngredient = (req, res) => {
  const { errors, isValid } = validateIngredientInput(req.body);

  console.log('Valid', req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  const ingredientFields = {};
  ingredientFields.user = req.user.id;
  if (req.body.displayName) {
    ingredientFields.displayName = req.body.displayName;
    ingredientFields.urlName = req.body.displayName
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  ingredientFields.metrics = {};
  if (req.body.cup) {
    ingredientFields.metrics.cup = req.body.cup;
    ingredientFields.metrics.tablespoon = req.body.cup / 16;
    ingredientFields.metrics.teaspoon =
      ingredientFields.metrics.tablespoon / 48;
  }

  // return res.status(400).json(ingredientFields);

  Ingredient.findOne({ urlName: ingredientFields.urlName }).then(
    ingredient => {
      if (ingredient) {
        errors.ingredient = `There is an ingredient already registered by name ${
          ingredientFields.urlName
        }`;
        return res.status(400).json({ errors });
      } else {
        const newIngredient = new Ingredient(ingredientFields);

        newIngredient
          .save()
          .then(ingredient => {
            if (!ingredient) {
              errors.ingredient =
                'There was an error creating your ingredient';
              return res.status(400).json(errors);
            }
            return res.status(200).json(ingredient);
          })
          .catch(err => {
            errors.ingredient =
              'There was an error saving your ingredient';
            return res.status(400).json({
              errors,
              error: err.response.data
            });
          });
      }
    }
  );
};
module.exports.addIngredient = addIngredient;

const editIngredientByID = (req, res) => {
  const { errors, isValid } = validateIngredientInput(req.body);

  console.log('Valid', req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  const ingredientFields = {};
  ingredientFields.user = req.user.id;
  if (req.body.displayName) {
    ingredientFields.displayName = req.body.displayName;
    ingredientFields.urlName = req.body.displayName
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  ingredientFields.metrics = {};
  if (req.body.cup) {
    ingredientFields.metrics.cup = req.body.cup;
    ingredientFields.metrics.tablespoon = req.body.cup / 16;
    ingredientFields.metrics.teaspoon =
      ingredientFields.metrics.tablespoon / 48;
  }
  if (req.body.whole) ingredientFields.metrics.whole = req.body.whole;

  Ingredient.findOneAndUpdate(
    { _id: req.params.ingredient_id },
    { $set: ingredientFields },
    { new: true }
  )
    .then(ingredient => {
      return res.json(ingredient);
    })
    .catch(err => {
      errors.ingredient = 'Ingredient could not be updated';
      return res.status(400).json({
        errors: errors,
        error: err.response.data
      });
    });
};
module.exports.editIngredientByID = editIngredientByID;

const deleteIngredientByID = (req, res) => {
  Ingredient.findByIdAndDelete(req.params.ingredient_id)
    .then(ingredient => {
      if (ingredient) {
        return res.status(200).json({
          message: `Your successfully deleted the ingredient: ${
            ingredient.displayName
          }`
        });
      } else {
        return res.status(404).json({
          message: 'We could not find an ingredient by that ID'
        });
      }
    })
    .catch(err => {
      return res.status(404).json({
        message: 'We could not find an ingredient by that ID',
        error: err
      });
    });
};
module.exports.deleteIngredientByID = deleteIngredientByID;

const addSupplierToIngredient = (req, res) => {
  req.body.ingredient_id = req.params.ingredient_id;
  req.body.supplier_id = req.params.supplier_id;

  const { errors, isValid } = validateIngredientSupplierInput(
    req.body
  );

  // console.log('Valid', req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  // Find ingredient by ID to confirm ingredient exists
  Ingredient.findById(req.body.ingredient_id).then(ingredient => {
    if (!ingredient) {
      errors.ingredient = 'We could not find the ingredient selected';
      return res.status(404).json(errors);
    }

    // If ingredient is found, find supplier by ID to confirm supplier exists
    Supplier.findById(req.body.supplier_id).then(supplier => {
      if (!supplier) {
        errors.supplier = 'We could not find the supplier selected';
        return res.status(404).json(errors);
      }

      //Format ingredient & supplier data
      const ingredientSupplierData = {};
      ingredientSupplierData.supplier = supplier.id;
      ingredientSupplierData.packageCost = req.body.packageCost;
      ingredientSupplierData.packageGrams = req.body.packageGrams;

      const SupplierIngredientData = {};
      SupplierIngredientData.ingredient = ingredient.id;
      console.log(
        '-------> ingredientSupplierData: ',
        ingredientSupplierData
      );
      console.log(
        '-------> SupplierIngredientData: ',
        SupplierIngredientData
      );

      // Check if ingredient already has the supplier
      const confirmIngredientSupplier = ingredient.suppliers.filter(
        ingredientSupplier => {
          console.log(
            '-------> ingredientSupplier: ',
            ingredientSupplier
          );

          return ingredientSupplier.supplier == supplier.id;
        }
      );
      const confirmSupplierIngredientID = supplier.ingredients.filter(
        supplierIngredient => {
          return supplierIngredient.ingredient == ingredient.id;
        }
      );

      console.log(
        'confirmIngredientSupplier: ',
        confirmIngredientSupplier.length
      );
      console.log(
        'confirmIngredientSupplier: ',
        confirmSupplierIngredientID.length
      );
      console.log('SupplierIngredientData: ', SupplierIngredientData);

      if (
        confirmIngredientSupplier.length === 0 &&
        confirmSupplierIngredientID.length === 0
      ) {
        console.log('Add Ingredient To Supplier');
        supplier.ingredients.push(SupplierIngredientData);
        supplier
          .save()
          .then(supplierSaved => {
            if (!supplierSaved) {
              // errors.ingredient =
              // 'We could save the ingredient to this supplier';
              return res.status(400).json({
                message:
                  'We could not save the ingredient to this supplier'
              });
            }
            console.log(
              'Added Ingredient To Supplier',
              supplierSaved
            );
          })
          .catch(err => {
            return res.status(404).json({
              message: 'Catch Error on Supplier',
              mongoError: err
            });
          });
        console.log(
          '-----> ingredientSupplierData: ',
          ingredientSupplierData
        );

        ingredient.suppliers.push(ingredientSupplierData);
        console.log('-----> ingredient: ', ingredient);
        ingredient
          .save()

          // #ingredientSaved was needed here..
          .then(ingredient => {
            if (!ingredient) {
              errors.ingredient =
                'We could save the supplier to this ingredient';
              return res.status(404).json(errors);
            }

            console.log('-----> ingredient: ', ingredient);

            return res.status(200).json({
              message: 'Ingredient & Supplier Saved',
              ingredient
            });
          })
          .catch(err => {
            errors.ingredient =
              'We could save the supplier to this ingredient';
            return res.status(404).json({ errors, mongoError: err });
          });
      } else {
        console.log('Update Supplier On The Ingredient');
        console.log(
          'confirmIngredientSupplier[0]',
          confirmIngredientSupplier[0]
        );
        console.log('ingredientSupplierData', ingredientSupplierData);
        confirmIngredientSupplier[0].set(ingredientSupplierData);
        ingredient.save().then(ingredient => {
          if (!ingredient) {
            errors.ingredient =
              'We could update the supplier details for this ingredient';
            return res.status(404).json(errors);
          }
          console.log('Updated Supplier Details For Ingredient');
          return res.status(200).json({
            message: 'Ingredient Supplier Updated',
            ingredient
          });
        });
      }
    });
  });
};
module.exports.addSupplierToIngredient = addSupplierToIngredient;
