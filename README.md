# Namespot
Generate classroom seating charts, rosters, flash cards, and name tents. Originally built for the University of Chicago Law School.

## Description
Web app tool for creating seating charts, flash cards, and name tents as downloadable PDFs. The app is built with the [Laravel](https://github.com/laravel/laravel) PHP framework and with [React](https://github.com/facebook/react) + [Redux](https://github.com/reduxjs/redux) on the front-end. It uses [html2canvas](https://github.com/niklasvh/html2canvas) and [jsPDF](https://github.com/MrRio/jsPDF) to generate the PDF deliverables.

Flash cards are built for Avery template #5388, and name tents are built for Avery template #5309.

## Installation
The site uses Laravel, so first head over to www.laravel.com and make sure your server meets the installation requirements.

Download this repository and put to into your project's folder. Then ```cd``` into it and run:

```composer install```

Note: Depending on how you have Composer installed, this may instead be ```php composer.phar install```

Next, make sure you have Node and NPM installed, and then run:

```npm install```

Finally, set up Laravel's .ENV file with your database's credentials, and then run ```php artisan migrate```. This should setup all required tables and columns. Voila!

## Using Namespot

You'll probably want to make rooms first. Go to Rooms from the menu and create/edit them from there.

For names and classes, it's up to you to populate your database. We have our Namespot instance dispatching nightly Jobs to grab data from our university's database with [Guzzle](https://github.com/guzzle/guzzle). For inspiration for your own jobs, feel free to checkout ours in ```apps\Jobs```. A planned feature for the future is the ability to import a CSV and get your data into the app that way.

## Some Helpful Links
Sometimes when starting a new Laravel project you might have some issues with permissions writing to the log file. I found this thread to be helpful: https://laracasts.com/discuss/channels/general-discussion/laravel-framework-file-permission-security/replies/163407.

For issues with dispatching emails, check https://github.com/swiftmailer/swiftmailer/issues/544.
