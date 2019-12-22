// The data is initially loaded from a json file
// once loaded the data is managed in memeory
// This service is meant to simulate interacting with a database for convinience

const rawData = require('./data.json');
const cart = {
  items: [],
  promotions: [],
  subtotal: 0,
  taxes: 0,
  total: 0
};

exports.getAllItems = async () => copyObject(rawData.items);
exports.getInventory = async () => copyObject(rawData.inventory);
exports.getItem = async itemId => copyObject(rawData.items.find(i => i.id === itemId));
exports.getItemInventory = async itemId => copyObject(rawData.inventory.find(d => d.itemId === itemId));

exports.decrementInventory = async (itemId, quantity) => {
  const inventory = rawData.inventory.find(d => d.itemId === itemId);
  inventory.available -= quantity;
  if (inventory.available < 0) inventory.available = 0;
  return inventory;
};

exports.incrementInventory = async (itemId, quantity) => {
  const inventory = rawData.inventory.find(d => d.itemId === itemId);
  if (quantity === -1) inventory.available = inventory.stock;
  else inventory.available += quantity;
  if (inventory.available > inventory.stock) inventory.available = inventory.stock;
  return inventory;
};

exports.getCart = async () => copyObject(cart);

exports.addToCart = async (item, quantity) => {
  const found = cart.items.find(i => i.itemId === item.id);

  if (found) {
    found.quantity += quantity;
  } else {
    cart.items.push({
      itemId: item.id,
      displayName: item.displayName,
      price: item.price,
      quantity
    });
  }
};

exports.removeFromCart = async (itemId, quantity) => {
  const item = cart.items.find(i => i.itemId === itemId);
  if (item) {
    if (quantity === -1) item.quantity = 0;
    else item.quantity -= quantity;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.itemId !== itemId);
    }
  }
};

exports.setCartItemPromotions = async (itemId, promotions) => {
  const cartItem = cart.items.find(i => i.itemId === itemId);
  if (cartItem) cartItem.promotions = promotions;
};

exports.setCartItemModifiers = async (itemId, modifiers, qauntity) => {
  const cartItem = cart.items.find(i => i.itemId === itemId);
  modifiers.forEach(m => m.quantity = qauntity);
  if (cartItem) cartItem.modifiers = modifiers;
};

exports.updateCartCalculations = async({ items, subtotal, discount, taxes, total }) => {
  const itemsById = items.reduce((a, b) => {
    a[b.itemId] = b;
    return a;
  }, {});

  cart.items.forEach(item => {
    item.calculations = itemsById[item.itemId];
  });

  cart.subtotal = subtotal;
  cart.discount = discount;
  cart.taxes = taxes;
  cart.total = total;
};

// simple copy method so we do not send out the original reference
function copyObject(value) {
  if (!value) return undefined;
  return JSON.parse(JSON.stringify(value));
}
