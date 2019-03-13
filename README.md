# Laravel + TypeScript + React 🚜
Boilerplate code featuring all the awesomeness of [Laravel 5.8](https://github.com/laravel/laravel), [TypeScript 3.3](https://github.com/Microsoft/TypeScript), [React 16.8](https://github.com/facebook/react).

## Also Starring:
- ESLint (extending AirBNB and @typescript-eslint)
- Redux (with Thunk and DevTools)
- React Router DOM
- React Transition Group
- FontAwesome 5
- Styled Components
- normalize.css
- Axios

## Installation
Prereqs: Install [node, npm](https://nodejs.org/en/), and [Composer](https://getcomposer.org/). Check that your server meets [Laravel's requirements](https://laravel.com/docs/5.8).

Then,\
`git clone https://github.com/elramus/laravel-typescript-react-boilerplate.git`\
`cd` into the new folder\
`composer install`\
`npm install`

Next, you'll want to rename `.env.example` to just `.env` and fill out any basic settings you want, like `APP_NAME`.

Now run `php artisan key:generate`. That will populate the `APP_KEY` field in the env file we just made. 

To fire up the dev server, use `npm run watch`. However, you'll probably need to do some additional configuration with BrowserSync in `webpack.mix.js` depending on how you have your project files setup. For example, I have to specify localhost and the specific directory of this project like so:
```
...
  .browserSync({
    proxy: 'localhost/laravel-typescript-react-boilerplate/public',
  })
  ...
```

Laravel's [installation page](https://laravel.com/docs/5.8/installation) is pretty helpful when setting up, so check it out first if you have any issues. 

<strong>Happy developing!! 🚜</strong>
