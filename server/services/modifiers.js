const {
  getCart,
  getItem,
  getInventory,
  setCartItemModifiers,
  decrementInventory,
  incrementInventory
} = require('../database/data-service.js');


exports.applyModifiers = async (itemId, quantity) => {
  const currentCart = await getCart();
  const cartItem = currentCart.items.find(i => i.itemId === itemId);

  const modifiers = await applyModifiers(itemId, quantity);

  if (modifiers && modifiers.length) await setCartItemModifiers(itemId, modifiers, cartItem.quantity);
};

// add modifer to item and decrement inventory
async function applyModifiers(itemId, quantity) {
  const item = await getItem(itemId);
  const allInventory = await getInventory();
  const availableModifiers = item.modifiers.filter(({ itemId }) => validateModifiers(itemId, quantity, allInventory));
  availableModifiers.forEach(modifier => {
    decrementInventory(modifier.itemId, 1);
  });
  return availableModifiers;
}

// return inventory availability for removed modifier
exports.removeModifiers = async (itemId, quantity) => {
  const item = await getItem(itemId);

  if (!item || !item.modifiers) return;

  item.modifiers.forEach(modifier => {
    incrementInventory(modifier.itemId, quantity);
  });
};

// validate modifier
function validateModifiers(itemId, quantity, allInventory) {
  const { available } = allInventory.find(i => i.itemId === itemId);

  // meets availability
  if (available < quantity) return false;
  return true;
}
