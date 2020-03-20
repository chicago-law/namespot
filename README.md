# Namespot 💺
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

### Adding new staff users
At the moment there is no UI functionality for CRUDing staff. Faculty members are created automatically as instructors when they log in, but that works by checking if they're attached to any classes first. A new staff member trying this will be turned away. So, first you'll need to add them to the DB. Do a SQL insert on the users table with their info and make their role 'staff'. The role of 'dev' is a superuser.

### Rooms
To CRUD rooms, go to the Rooms page from the menu. A "room" is basically just a grid of coordinates laid out over a rectangle. A "table" is just a line with start and end coordinates, and optionally a middle coordinate for it to bend towards. A table will then distribute its seats evenly along its line. That's pretty much it.

### Class and Student Data
For all the data related to classes and students, it's up to you to populate your database. We have our own Namespot instance dispatching nightly Jobs to grab data from our university's database with [Guzzle](https://github.com/guzzle/guzzle). For inspiration for your own jobs, check out ours in ```apps\Jobs```.
