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

async function applyModifiers(itemId, quantity) {
  const item = await getItem(itemId);
  const allInventory = await getInventory();
  const availableModifiers = item.modifiers.filter(({ itemId }) => validateModifiers(itemId, quantity, allInventory));
  availableModifiers.forEach(modifier => {
    decrementInventory(modifier.itemId, 1);
  });
  return availableModifiers;
}


// exports.applyModifiers = async (cart) => {
//   await Promise.all(cart.items.map(async ({ itemId, quantity }) => {
//     const modifiers = await applyModifiers(itemId, quantity);
//
//     if (currentItemId === itemId) {
//       modifiers.forEach(modifier => {
//         decrementInventory(modifier.itemId, 1);
//       });
//     }
//
//     await setCartItemModifiers(itemId, modifiers, quantity);
//   }));
// };

// async function applyModifiers(itemId, quantity) {
//   const item = await getItem(itemId);
//   const allInventory = await getInventory();
//   return item.modifiers.filter(({ itemId }) => validateModifiers(itemId, quantity, allInventory));
// }

exports.removeModifiers = async (itemId, quantity) => {
  const item = await getItem(itemId);

  if (!item || !item.modifiers) return;

  item.modifiers.forEach(modifier => {
    incrementInventory(modifier.itemId, quantity);
  });
};


function validateModifiers(itemId, quantity, allInventory) {
  const { available } = allInventory.find(i => i.itemId === itemId);

  // meets availability
  console.log(available, quantity);
  if (available < quantity) return false;
  return true;
}
