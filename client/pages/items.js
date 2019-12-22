import { Page, html } from '@webformula/pax-core';
import orderService from '../order-service.js';

export default class Items extends Page {
  async connectedCallback() {
    this.bound_addQuantity = this.addQuantity.bind(this);
    this.bound_removeQuantity = this.removeQuantity.bind(this);
    this.bound_addToCart = this.addToCart.bind(this);

    // get data
    const [items, inventory] = await Promise.all([
      orderService.getItems(),
      orderService.getInventory()
    ]);
    this._items = items;
    this._inventory = inventory;
    this.render();
  }

  disconnectedCallback() {
    // remove listeners
    this.beforeRender();
  }

  afterRender() {
    const plusButtons = document.querySelectorAll('.plus-button');
    const minusButtons = document.querySelectorAll('.minus-button');
    const addCartButtons = document.querySelectorAll('.add-to-cart-button');

    plusButtons.forEach(el => el.addEventListener('click', this.bound_addQuantity));
    minusButtons.forEach(el => el.addEventListener('click', this.bound_removeQuantity));
    addCartButtons.forEach(el => el.addEventListener('click', this.bound_addToCart));
  }

  beforeRender() {
    const plusButtons = document.querySelectorAll('.plus-button');
    const minusButtons = document.querySelectorAll('.minus-button');
    const addCartButtons = document.querySelectorAll('.add-to-cart-button');

    plusButtons.forEach(el => el.removeEventListener('click', this.bound_addQuantity));
    minusButtons.forEach(el => el.removeEventListener('click', this.bound_removeQuantity));
    addCartButtons.forEach(el => el.removeEventListener('click', this.bound_addToCart));
  }

  get title() {
    return 'Store';
  }

  get items() {
    return this._items || [];
  }

  getInventoryDisplay(itemId) {
    const itemInventory = this._inventory.find(i => i.itemId === itemId);
    if (!itemInventory) return '';
    return `<i>stock:</i> ${itemInventory.available} of ${itemInventory.stock} available`;
  }

  addQuantity(event) {
    const itemId = parseInt(event.target.getAttribute('item-id'));
    const item = this.items.find(i => i.id === itemId);

    // TODO add max wuantity check vs inventory

    item.quantity = item.quantity || 1;
    item.quantity += 1;
    this.render();
  }

  removeQuantity(event) {
    const itemId = parseInt(event.target.getAttribute('item-id'));
    const item = this.items.find(i => i.id === itemId);

    // prevent from going below 0
    if (item.quantity === undefined || item.quantity === 1) return;

    item.quantity = item.quantity || 1;
    item.quantity -= 1;
    this.render();
  }

  async addToCart(event) {
    const itemId = parseInt(event.target.getAttribute('item-id'));
    const item = this.items.find(i => i.id === itemId);

    orderService.addToCart(item);
    this._inventory = await orderService.getInventory();
    event.target.resolve();
    this.render();
  }

  available(itemId) {
    const itemInventory = this._inventory.find(i => i.itemId === itemId);
    return itemInventory.available > 0;
  }

  template() {
    return html`
      <h2>Store</h2>

      <mdw-list class="mdw-three-line">
        ${this.items.map(item => html`
          <mdw-list-item>
            <mdw-icon>inbox</mdw-icon>
            <div class="mdw-list-item__text">
              <div class="mdw-list-item__primary-text">
                ${item.displayName}
              </div>
              <div class="mdw-list-item__secondary-text">
                ${this.getInventoryDisplay(item.id)}
              </div>
              <div class="mdw-list-item__secondary-text">
                ${item.price}
              </div>
            </div>

            <div class="mdw-list-item__meta" mdw-row mdw-flex-position="center center">
              <mdw-button mdw-async ${this.available(item.id) ? '' : 'disabled'} item-id="${item.id}" class="mdw-primary mdw-raised add-to-cart-button">
                Add to cart
              </mdw-button>

              <div>
                <mdw-button item-id="${item.id}" class="minus-button mdw-icon">
                  <mdw-icon style="pointer-events: none">remove</mdw-icon>
                </mdw-button>

                <span>${item.quantity || 1}</span>

                <mdw-button item-id="${item.id}" class="plus-button mdw-icon">
                  <mdw-icon style="pointer-events: none">add</mdw-icon>
                </mdw-button>
              </div>
            </div>
          </mdw-list-item>
        `).join('\n')}
     </mdw-list>
    `;
  }
};
