const mix = require('laravel-mix')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
   .copyDirectory('resources/assets/spreadsheets', 'public/spreadsheets')
   .sourceMaps()
   .browserSync({
     proxy:'localhost/namespot/public'
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
  .webpackConfig({
    devtool: 'source-map',
    // plugins: [
    //   new BundleAnalyzerPlugin(),
    // ]
  })
  .disableSuccessNotifications()

if (mix.inProduction()) {
  mix.version()
}
