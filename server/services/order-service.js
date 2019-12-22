const {
  getAllItems,
  getInventory,
  getItem,
  getItemInventory,
  decrementInventory,
  incrementInventory,
  getCart,
  addToCart,
  removeFromCart
} = require('../database/data-service.js');
const {
  applyItemPromotions
} = require('../services/promotions.js');
const {
  applyModifiers,
  removeModifiers
} = require('../services/modifiers.js');
const {
  calculateOrder
} = require('../services/calculation.js');

exports.getAllItems = getAllItems;
exports.getInventory = getInventory;
exports.getItem = async itemId => {
  if (!itemId) throw Error('requires itemId');
  const item = await getItem(itemId);
  if (!item) throw Error(`could not find item for itemId '${itemId}'`);
  return item;
};
exports.getItemInventory = async itemId => {
  // make sure item exists
  await exports.getItem(itemId);
  const data = await getItemInventory(itemId);
  if (!data) throw Error(`could not find inventory for itemId '${itemId}'`);
  return data;
};

exports.decrementInventory = async ({ itemId, quantity }) => {
  // make sure item exists
  await exports.getItem(itemId);
  return decrementInventory(itemId, quantity);
};

exports.incrementInventory = async ({ itemId, quantity }) => {
  // make sure item exists
  await exports.getItem(itemId);
  return incrementInventory(itemId, quantity);
};

exports.getCart = getCart;

exports.addItemToCart = async ({ itemId, quantity }) => {
  const [ item, inventory ] = await Promise.all([
    exports.getItem(itemId),
    exports.getItemInventory(itemId)
  ]);

  // validate inventory
  if (inventory.available < quantity) throw Error('not enough items in stock');

  // add to cart and adjust inventory
  await addToCart(item, quantity);
  await decrementInventory(itemId, quantity);

  // handle promotions
  await applyModifiers(itemId, quantity);

  // handle promotions
  await applyItemPromotions(await getCart());

  // calculate order
  await calculateOrder(await getCart());

  return getCart();
};

exports.removeItemFromCart = async ({ itemId, quantity }) => {
  // make sure item exists
  await exports.getItem(itemId);
  await removeModifiers(itemId, quantity);
  await removeFromCart(itemId, quantity);
  await incrementInventory(itemId, quantity);

  // calculate order
  await calculateOrder(await getCart());

  return getCart();
};
