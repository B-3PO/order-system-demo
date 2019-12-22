const orderService = new class {
  constructor() {
    if (window.axios) {
      this.axiosClient = window.axios.create({
        baseUrl: 'http://localhost:3001'
      });
    }
  }

  async getItems() {
    const { data } = await this.axiosClient.get('/api/items');
    return data.items || [];
  }

  async getInventory() {
    const { data } = await this.axiosClient.get('/api/inventory');
    return data.inventory || [];
  }

  async getCart() {
    const { data } = await this.axiosClient.get('/api/cart');
    return data.cart || {};
  }

  async addToCart({ id, quantity = 1 }) {
    await this.axiosClient.post('/api/add-item-to-cart', {
      itemId: id,
      quantity
    });
  }

  async removeFromCart({ id, quantity = -1 }) {
    const { data } = await this.axiosClient.post('/api/remove-item-from-cart', {
      itemId: id,
      quantity
    });
    return data.cart;
  }
};

export default orderService;

globalThis.orderService = orderService;
