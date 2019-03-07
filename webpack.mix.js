const mix = require('laravel-mix')

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

mix.ts('resources/js/index.tsx', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .sourceMaps()
  .browserSync({
    proxy: 'localhost/sandboxes/laravel-typescript-react/public',
  })
if (!mix.inProduction()) {
  mix.webpackConfig({
    output: {
      publicPath: '/sandboxes/laravel-typescript-react/public/',
    },
  })
}
