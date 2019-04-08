const express = require('express');
const router = express.Router();
const itemController = require('./item.controllers');

// /api/item
router.route('/').get(itemController.getMany);
router.route('/').post(itemController.createItem);

// /api/item/:id
router.route('/:id').delete(itemController.removeItem);
// .get(controllers.getOne)
router.route('/:id').put(itemController.updateItem);

module.exports = router;
