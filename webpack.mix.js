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

mix.react('resources/assets/js/main.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
   .copyDirectory('resources/assets/images', 'public/images')
   .copyDirectory('resources/assets/js/vendor', 'public/js')
   .sourceMaps()
   .browserSync({
     proxy:'namespot.localhost'
   })
   .options({
    uglify: {
      uglifyOptions: {
        compress: {
          collapse_vars: false
        }
      }
    }
  })
  .disableSuccessNotifications()

if (mix.inProduction()) {
  mix.version()
}
