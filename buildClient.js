import { build } from '@webformula/pax-core';

build({
  rootFolder: 'client',
  pagesFolder: 'pages',
  layoutFilePath: 'layout/index.js',
  distFolder: 'dist',
  routerConfig: {
    root: 'items'
  }
});
