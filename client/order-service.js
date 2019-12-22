export default new class {
  constructor() {
    if (window.axios) {
      this.axiosClient = window.axios.create({
        baseURL: 'http://localhost:3001/api'
      });
    }
  }

  async getItems() {
    const { data } = await this.axiosClient.get('/items');
    return data.items || [];
  }

  async getInventory() {
    const { data } = await this.axiosClient.get('/inventory');
    return data.inventory || [];
  }

  async getCart() {
    const { data } = await this.axiosClient.get('/cart');
    return data.cart || {};
  }

  async addToCart({ id, quantity = 1 }) {
    await this.axiosClient.post('/add-item-to-cart', {
      itemId: id,
      quantity
    });
  }

  async removeFromCart({ id, quantity = -1 }) {
    const { data } = await this.axiosClient.post('/remove-item-from-cart', {
      itemId: id,
      quantity
    });
    return data.cart;
  }
};
