const Big = require('big.js');

const {
  getCart,
  getItem,
  updateCartCalculations
} = require('../database/data-service.js');

// callculate all items and adjustments
exports.calculateOrder = async () => {
  const cart = await getCart();
  const itemCalculations = await calculateItems(cart.items);
  await updateCartCalculations({
    items: itemCalculations.items,
    subtotal: itemCalculations.subtotal,
    discount: itemCalculations.discount,
    taxes: 0,
    total: itemCalculations.total
  });
};


async function calculateItems(items) {
  // prep items for calculations
  items = await Promise.all(items.map(async ({ itemId, quantity, promotions }) => {
    const item = await getItem(itemId);
    return {
      item,
      quantity,
      promotions
    };
  }));

  // calculate base item and item promotions
  const itemCalculations = items.map(({ item, quantity, promotions = [] }) => {
    const subtotal = Big(item.price).times(quantity);
    const discount = calculateAdjustments(subtotal, promotions.flatMap(({ adjustments }) => adjustments));

    return {
      itemId: item.id,
      subtotal,
      discount,
      total: subtotal.plus(discount)
    };
  });

  // get totals for all items
  const total = itemCalculations.reduce((a, { subtotal, discount }) => a.plus(subtotal).plus(discount), Big(0));
  const subtotal = itemCalculations.reduce((a, { subtotal }) => a.plus(subtotal), Big(0));
  const discount = itemCalculations.reduce((a, { discount }) => a.plus(discount), Big(0));

  return {
    items: itemCalculations,
    subtotal,
    discount,
    total
  };
}

// calculate item adjustments
function calculateAdjustments(subtotal, adjustments) {
  return adjustments
    .filter(({ type }) => type === 'discount')
    .reduce((a, { properties: { amount, percent } }) => {
      // percent id presented from 1 to 100
      if (percent === true) return a.plus( Big(subtotal).times( Big(amount).div(100) ).times(-1) );
      return a.minus(amount);
    }, Big(0));
}
