const Item = require('./item.model');

const getMany = (req, res) => {
  Item.find().then(items => {
    if (items) {
      return res.status(200).json(items);
    } else {
      return res.status(404).json({ message: 'No items found' });
    }
  });
};
module.exports.getMany = getMany;

// Assuming this is from a POST request and the body of the
// request contained the JSON of the new item to be saved
const createItem = (req, res) => {
  const newItem = new Item(req.body);
  newItem.save(err => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(console.log(newItem));
  });
};
module.exports.createItem = createItem;

const removeItem = (req, res) => {
  console.log('You found the delete function');

  Item.findByIdAndRemove(req.params.id, (err, item) => {
    // As always, handle any potential errors:
    if (err) {
      return res.status(500).send(err);
    }
    // We'll create a simple object to send back with a message and the id of the document that was removed
    const response = {
      message: `${item.name} was successfully deleted`,
      id: item._id
    };
    return res.status(200).send(response);
  });
};
module.exports.removeItem = removeItem;

const updateItem = (req, res) => {
  console.log('You found the delete function');

  Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, item) => {
      // As always, handle any potential errors:
      if (err) {
        return res.status(500).send(err);
      }
      // We'll create a simple object to send back with a message and the id of the document that was removed
      const response = {
        message: `${item.name} was successfully updated`,
        id: item._id
      };
      return res.status(200).send(response);
    }
  );
};
module.exports.updateItem = updateItem;
