const mix = require('laravel-mix')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
// const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')

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
   .browserSync({
     proxy:'localhost/namespot/public'
   })
mix.webpackConfig({
  plugins: [
    // new BundleAnalyzerPlugin(),
    new BabelMinifyPlugin()
  ]
})
