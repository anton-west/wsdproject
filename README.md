WSD project documentation
===========

Deployment
----------
try out the web application [here](https://wsd-project-s2020.herokuapp.com/)

CREATE TABLE statements
-----------------------
```

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(320) NOT NULL,
	password CHAR(60) NOT NULL
);

CREATE TABLE mornings(
	id SERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	date DATE NOT NULL,
	sleep_amount NUMERIC(20, 10) NOT NULL,
	sleep_quality INT NOT NULL,
	mood INT NOT NULL
);

CREATE TABLE evenings(
	id SERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	date DATE NOT NULL,
	sport_amount NUMERIC(20, 10) NOT NULL,
	study_amount NUMERIC(20, 10) NOT NULL,
	eating_quality INT NOT NULL,
	eating_regularity INT NOT NULL,
	mood INT NOT NULL
);

```

Running the App Locally
-----------------------
To run the web application locally, create the needed tables in your database. Then copy
your database information and credentials into `config.database` object in `./config/config.js` .

Then run the command `deno run --allow-net --allow-env --allow-read --unstable app.js` in the root folder of the project.

The application uses port 7777 by default. visit the site at [http://localhost:7777/](http://localhost:7777/)

Using the Application
---------------------

You will be presented with the landing page when you first visit the site.
Login at "/auth/login" or register a "/auth/registration". 
You can also use the links at the landing page. You need to be logged in
to access the summary and report pages. They are found at "/behavior/summary"
and at "/behavior/reporting". If you are logged in, then you can use the links
at the landing page to access these pages. Fill in the forms to make a report.
A new report will overwrite an old one, if it exists for that day. You can
choose what week or month you want to inspect on the summary page. The summary
page will only show statistics about this year i.e. 2020. So the months and weeks
will only correspond to months and weeks in the year 2020. 

Running the tests
-----------------
Run one of the following commands in the root folder of the project
#### Windows
`deno test --allow-net --allow-env --allow-read --allow-write --unstable  .\tests\app_test.js`

#### Linux/Mac
`deno test --allow-net --allow-env --allow-read --allow-write --unstable  ./tests/app_test.js`
