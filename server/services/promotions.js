const {
  getItem,
  setCartItemPromotions
} = require('../database/data-service.js');

exports.applyItemPromotions = async (cart) => {
  await Promise.all(cart.items.map(async ({ itemId, quantity }) => {
    const promotion = await getPromotionItemAdjustments(itemId, quantity);
    await setCartItemPromotions(itemId, promotion);
  }));
};


async function getPromotionItemAdjustments(itemId, quantity) {
  const item = await getItem(itemId);
  return item.promotions.filter(({ autoApply, requirements }) => validatePromotion(autoApply, requirements, { quantity }));
}


function validatePromotion(autoApply, requirements = {}, itemParams) {
  if (!autoApply) return false;

  // meets minimum qunatity
  if (requirements.minQuantity !== undefined && requirements.minQuantity > (itemParams.quantity || 0)) return false;

  return true;
}
