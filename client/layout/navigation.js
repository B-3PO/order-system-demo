import { html } from '@webformula/pax-core';

export default function () {
  return html`
    <mdw-drawer class="navigation mdw-white mdw-locked-open">
      <mdw-drawer-fixed>
        <mdw-drawer-header>
          <div class="mdw-title">Menu</div>
        </mdw-drawer-header>

        <mdw-drawer-content>
          <mdw-list>
            <mdw-list-item href="#/items" href-alt="#/">
              <span class="mdw-list-item__graphic material-icons">home</span>
              Store
            </mdw-list-item>

            <mdw-list-item href="#/cart">
              <span class="mdw-list-item__graphic material-icons">shopping_cart</span>
              Cart
            </mdw-list-item>

          </mdw-list>
        </mdw-drawer-content>
      </mdw-drawer-fixed>
    </mdw-drawer>
  `;
}
