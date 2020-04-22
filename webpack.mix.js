const mix = require('laravel-mix') //eslint-disable-line

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

mix.ts('resources/js/index.js', 'public/js')
  .sass('resources/sass/main.scss', 'public/css')
  .copyDirectory('resources/images', 'public/images')
  .copyDirectory('resources/js/vendor', 'public/js')
  .copyDirectory('resources/templates', 'public/templates')
  .sourceMaps()
  .browserSync({
    proxy: 'namespot.localhost',
  })
  .version()
