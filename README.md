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
your database information and credentials into`config.database`object in `./config/config.js`.

Then use the command`deno run --allow-net --allow-env --allow-read --unstable app.js`in the root folder of the project.

The application uses port 7777 by default. visit the site at [http://localhost:7777/](http://localhost:7777/)

Running the tests
-----------------
Run one of the following commands in the root folder of the project
#### Windows
`deno test --allow-net --allow-env --allow-read --allow-write --unstable  .\tests\app_test.js`

#### Linux/Mac
`deno test --allow-net --allow-env --allow-read --allow-write --unstable  ./tests/app_test.js`
