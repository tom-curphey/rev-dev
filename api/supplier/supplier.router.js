const express = require('express');
const router = express.Router();
const passport = require('passport');
const supplierController = require('./supplier.controller');

// @route   GET api/supplier/all
// @desc    Get all suppliers
// @access  Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  supplierController.getAllSuppliers
);

// @route   GET api/supplier/id/:supplier_id
// @desc    Get supplier by ID
// @access  Private
router.get(
  '/id/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  supplierController.getSupplierByID
);

// @route   GET api/supplier/:supplier_name
// @desc    Get supplier by url name
// @access  Private
router.get(
  '/:supplier_name',
  passport.authenticate('jwt', { session: false }),
  supplierController.getSupplierByUrlName
);

// @route   POST api/supplier
// @desc    Create supplier
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  supplierController.addSupplier
);

// @route   PUT api/supplier/editSupplierByID
// @desc    Edit supplier
// @access  Private
router.put(
  '/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  supplierController.editSupplierByID
);

module.exports = router;

// @route   DELETE api/supplier
// @desc    Delete supplier
// @access  Private
router.delete(
  '/:supplier_id',
  passport.authenticate('jwt', { session: false }),
  supplierController.deleteSupplierByID
);

module.exports = router;
