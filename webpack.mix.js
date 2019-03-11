const mix = require('laravel-mix')
const path = require('path')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

const ASSET_PATH = process.env.ASSET_PATH || '/'

mix.ts('resources/js/index.js', 'public/js')
  .sass('resources/sass/main.scss', 'public/css')
  .copyDirectory('resources/images', 'public/images')
  .sourceMaps()
  .browserSync({
    proxy: 'localhost/sandboxes/laravel-typescript-react/public',
  })
// if (!mix.inProduction()) {
// mix.webpackConfig({
//   output: {
//     publicPath: ASSET_PATH,
//   },
//   // module: {
//   //   rules: [
//   //     {
//   //       test: /\.(png|svg|jpg|gif)$/,
//   //       use: [
//   //         'file-loader',
//   //       ],
//   //     },
//   //   ],
//   // },
// })
// }
