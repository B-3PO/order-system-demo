const {
  getAllItems,
  getInventory,
  getItemInventory,
  decrementInventory,
  getCart,
  addItemToCart,
  removeItemFromCart
} = require('./services/order-service.js');
const express = require('express');
const router = express.Router();

// order routes
router.get('/items', async (req, res) => {
  const items = await getAllItems();
  res.send({ items });
});

router.get('/inventory', async (req, res) => {
  const inventory = await getInventory();
  res.send({ inventory });
});

router.post('/item-inventory', async (req, res) => {
  try {
    const itemInventory = await getItemInventory((req.body || {}).itemId);
    res.send({ itemInventory });
  } catch (e) {
    console.error(e);
    res.status(409).send({ error: e.message });
  }
});

router.post('/decrement-inventory', async (req, res) => {
  try {
    const inventory = await decrementInventory((req.body || {}));
    res.send({ inventory });
  } catch (e) {
    console.error(e);
    res.status(409).send({ error: e.message });
  }
});

router.get('/cart', async (req, res) => {
  const cart = await getCart();
  res.send({ cart });
});

router.post('/add-item-to-cart', async (req, res) => {
  try {
    const cart = await addItemToCart((req.body || {}));
    res.send({ cart });
  } catch (e) {
    console.error(e);
    res.status(409).send({ error: e.message });
  }
});

router.post('/remove-item-from-cart', async (req, res) => {
  try {
    const cart = await removeItemFromCart((req.body || {}));
    res.send({ cart });
  } catch (e) {
    console.error(e);
    res.status(409).send({ error: e.message });
  }
});


module.exports = router;
