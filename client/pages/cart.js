import { Page, html } from '@webformula/pax-core';
import orderService from '../order-service.js';

export default class Cart extends Page {
  constructor() {
    super();

    this.bound_removeItem = this.removeItem.bind(this);
  }

  async connectedCallback() {
    // get data
    this._cart = await orderService.getCart();
    this.render();
  }

  disconnectedCallback() {
    // remove listeners
    this.beforeRender();
  }

  afterRender() {
    const removeButtons = document.querySelectorAll('.remove-button');

    removeButtons.forEach(el => el.addEventListener('click', this.bound_removeItem));
  }

  beforeRender() {
    const removeButtons = document.querySelectorAll('.remove-button');

    removeButtons.forEach(el => el.removeEventListener('click', this.bound_removeItem));
  }

  get title() {
    return 'Cart';
  }

  get cart() {
    return this._cart || { items: [] };
  }

  async removeItem(event) {
    const itemId = parseInt(event.target.getAttribute('item-id'));
    this._cart = await orderService.removeFromCart({ id: itemId });
    event.target.resolve();
    this.render();
  }

  formatPromotions(item) {
    if (!item.promotions || !item.promotions.length) return '';

    const display = item.promotions.map(({ name }) => name).join(', ');
    return `<i>Promotions:</i> ${display} : <b>$${item.calculations.discount}</b>`;
  }

  template() {
    return html`
      <h2>Cart</h2>

      <mdw-list class="mdw-three-line">
        ${this.cart.items.map(item => html`
          <mdw-list-item>
            <mdw-icon>inbox</mdw-icon>
            <div class="mdw-list-item__text">
              <div class="mdw-list-item__primary-text">
                ${item.displayName} ($${item.price}) x <i>${item.quantity}</i>
              </div>
              <div class="mdw-list-item__secondary-text">
                ${this.formatPromotions(item)}
              </div>
              <div class="mdw-list-item__secondary-text">
                <i>Total:</i> <b>$${item.calculations.total}</b>
              </div>
            </div>

            <div class="mdw-list-item__meta" mdw-row mdw-flex-position="center center">
              <mdw-button mdw-async item-id="${item.itemId}" class="mdw-error mdw-raised remove-button">
                Remove
              </mdw-button>
            </div>
          </mdw-list-item>

          ${(item.modifiers || []).map(modifier => html`
            <mdw-list-item style="margin-left: 99px; margin-top: -6px; height: 40px;">
              <div class="mdw-list-item__text">
                <div class="mdw-list-item__primary-text">
                  ${modifier.displayName} x ${modifier.quantity}
                </div>
                <div class="mdw-list-item__secondary-text">
                  <i>price:</i> <b>$${modifier.price}</b>
                </div>
              </div>
            </mdw-list-item>
          `)}
        `).join('\n')}
     </mdw-list>

     <div style="height: 64px"></div>

     <mdw-list class="mdw-one-line" >
       <mdw-list-item>
         <div class="mdw-list-item__text">
          <i>subtotal:</i> $${this.cart.subtotal || 0}
         </div>
        </mdw-list-item>

        <mdw-list-item>
          <div class="mdw-list-item__text">
           <i>discount:</i> $${this.cart.discount || 0}
          </div>
         </mdw-list-item>

         <mdw-list-item>
           <div class="mdw-list-item__text">
            <i>total:</i> <b style="font-size: 22px">$${this.cart.total || 0}</b>
           </div>
          </mdw-list-item>
     </mdw-list>
    `;
  }
};
