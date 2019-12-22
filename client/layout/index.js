import { html } from '@webformula/pax-core';
import nav from './navigation.js';

export default function ({ head, body, title }) {
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Cache-Control" content="no-store" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>${title}</title>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">

        <!-- PAX components -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/webformula/pax-components@0.5.18-beta/dist/pax-components.css">
        <!-- NOTE type="module" -->
        <script type="module" src="https://cdn.jsdelivr.net/gh/webformula/pax-components@0.5.18-beta/dist/pax-components.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>

        ${head}
      </head>

      <body>
        ${nav()}

        <mdw-page>

          <header>
            <mdw-top-app-bar class="mdw-fixed mdw-white">
              <section>
                <mdw-icon onclick="document.querySelector('mdw-drawer.navigation').toggle()">menu</mdw-icon>
                <span class="mdw-title">Order system</span>
              </section>
              <section></section>
            </mdw-top-app-bar>
          </header>

          <mdw-content>
            ${body}
          </mdw-content>

        </mdw-page>
      </body>
    </html>
  `;
}
