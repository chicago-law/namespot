# Namespot
Generate classroom seating charts, flash cards, and name tents. Originally built for the University of Chicago Law School.

# Description
Web app tool for creating seating charts, flash cards, and name tents as downloadable PDFs. The app is built with the [Laravel](https://github.com/laravel/laravel) PHP framework and with [React](https://github.com/facebook/react) + [Redux](https://github.com/reduxjs/redux) on the front-end. It uses [html2canvas](https://github.com/niklasvh/html2canvas) and [jsPDF](https://github.com/MrRio/jsPDF) to generate the PDF deliverables.

Flash cards are built for the Avery template #5388, and name tents are built for the Avery template #5309.

# Installation
The site uses Laravel, so first head over to www.laravel.com and make sure your server meets the requirements.

```mkdir mynewproject```

```cd mynewproject```

```composer install```

Depending on how you have Composer installed, this may instead be ```php composer.phar install```

```npm install```

Sometimes when starting a new Laravel project you might have some issues with permissions writing to the log file. I found this thread to be helpful: https://laracasts.com/discuss/channels/general-discussion/laravel-framework-file-permission-security/replies/163407

Set up the .env file with any DB connection credentials you need, and then run ```php artisan migrate```. This should setup all required tables and columns.

Voila!

Note: For issues with dispatching emails, check https://github.com/swiftmailer/swiftmailer/issues/544
