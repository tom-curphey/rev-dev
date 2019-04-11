const User = require('../user/user.model');
const Supplier = require('./supplier.model');

// Load Input Validation
const validateSupplierInput = require('../../config/validation/supplier');

const getAllSuppliers = (req, res) => {
  Supplier.find()
    .then(suppliers => {
      if (!suppliers) {
        return res.status(400).json({
          message: 'There suppliers in the database'
        });
      }
      return res.status(200).json(suppliers);
    })
    .catch(err => {
      errors.supplier =
        'There was an error getting suppliers from the database';
      return res.status(400).json({
        errors,
        error: err.response.data
      });
    });
};
module.exports.getAllSuppliers = getAllSuppliers;

const getSupplierByID = (req, res) => {
  console.log(req.params);
  Supplier.findById(req.params.supplier_id)
    .then(supplier => {
      if (!supplier) {
        return res.status(400).json({
          message: 'No suppliers exist with this ID'
        });
      }
      return res.status(200).json(supplier);
    })
    .catch(err => {
      errors.supplier =
        'There was an error getting the supplier from the database';
      return res.status(400).json({
        errors,
        error: err.response.data
      });
    });
};
module.exports.getSupplierByID = getSupplierByID;

const getSupplierByUrlName = (req, res) => {
  Supplier.findOne({ urlName: req.params.supplier_name })
    .then(supplier => {
      if (!supplier) {
        return res.status(400).json({
          message: 'No suppliers exist with this Name'
        });
      }
      return res.status(200).json(supplier);
    })
    .catch(err => {
      return res.status(400).json({
        message:
          'There was an error getting the supplier from the database',
        error: err.response.data
      });
    });
};
module.exports.getSupplierByUrlName = getSupplierByUrlName;

const addSupplier = (req, res) => {
  const { errors, isValid } = validateSupplierInput(req.body);

  console.log(req.user);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  console.log('Al Good');

  const supplierFields = {};
  if (req.body.displayName) {
    supplierFields.displayName = req.body.displayName;
    supplierFields.urlName = req.body.displayName
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  if (req.body.email) {
    supplierFields.email = req.body.email;
  }
  if (req.body.phone) {
    supplierFields.phone = req.body.phone;
  }
  if (req.body.address) {
    supplierFields.address = req.body.address;
  }

  Supplier.findOne({
    $or: [
      { urlName: supplierFields.urlName },
      { email: supplierFields.email }
    ]
  }).then(supplier => {
    if (supplier) {
      errors.supplier =
        'There is already a supplier registered with these details';
      return res.status(400).json({
        errors: errors
      });
    } else {
      const newSupplier = new Supplier(supplierFields);

      newSupplier
        .save()
        .then(supplier => {
          if (!supplier) {
            errors.supplier =
              'There was an error creating your supplier';
            return res.status(400).json({
              errors: errors
            });
          }
          return res.status(200).json(supplier);
        })
        .catch(err => {
          errors.supplier = 'There was an error saving the supplier';
          return res.status(400).json({
            errors: errors,
            error: err.response.data
          });
        });
    }
  });
};
module.exports.addSupplier = addSupplier;

const editSupplierByID = (req, res) => {
  const { errors, isValid } = validateSupplierInput(req.body);

  console.log(req.user);

  // Check Validation
  if (!isValid) {
    // If any errors, send status 400 with errors object
    return res.status(400).json(errors);
  }

  console.log('Al Good');

  const supplierFields = {};
  if (req.body.displayName) {
    supplierFields.displayName = req.body.displayName;
    supplierFields.urlName = req.body.displayName
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  if (req.body.email) {
    supplierFields.email = req.body.email;
  }
  if (req.body.phone) {
    supplierFields.phone = req.body.phone;
  }
  if (req.body.address) {
    supplierFields.address = req.body.address;
  }
  if (req.user.admin) {
    supplierFields.registered = true;
  }

  console.log(supplierFields.urlName);

  Supplier.findOne({ urlName: supplierFields.urlName })
    .then(supplier => {
      if (supplier) {
        if (supplier.id !== req.params.supplier_id) {
          errors.displayName =
            'This Supplier has already registered with this name';
          return res.status(400).json(errors);
        }
      }
      Supplier.findOne({ email: supplierFields.email }).then(
        supplier => {
          if (supplier) {
            if (supplier.id !== req.params.supplier_id) {
              errors.email =
                'A Supplier has already registered with this email';
              return res.status(400).json(errors);
            }
          }

          Supplier.findOneAndUpdate(
            { _id: req.params.supplier_id },
            { $set: supplierFields },
            { new: true }
          )
            .then(supplier => {
              if (!supplier) {
                errors.supplier =
                  'There was an error saving the supplier to the database';
                return res.status(400).json({
                  errors
                });
              }
              return res.status(200).json(supplier);
            })
            .catch(err => {
              'There was an error saving the supplier to the database';
              return res.status(400).json({
                errors,
                error: err.response.data
              });
            });
        }
      );
    })
    .catch(err => {
      errors.supplier =
        'There was an error finding the supplier to be updated in the database';
      return res.status(400).json({
        errors,
        error: err.response.data
      });
    });
};
module.exports.editSupplierByID = editSupplierByID;

const deleteSupplierByID = (req, res) => {
  Supplier.findByIdAndDelete(req.params.supplier_id).then(
    supplier => {
      if (!supplier) {
        const errors = {};
        errors.supplier =
          'There was an error delete the supplier in the database';
        return res.status(400).json({
          errors
        });
      }
      return res.status(200).json({
        message: `${supplier.displayName} was successfully deleted`
      });
    }
  );
};
module.exports.deleteSupplierByID = deleteSupplierByID;
