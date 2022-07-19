import routes from './routes';

const bcrypt = require('bcryptjs');
const joi = require('joi');

const express = require('express');
const app = express();
const port = 3000;


// Database mock where the username is the primary key of a user.

// CODE HERE
//
// I want to be able to register a new unique user (username and password). After the user is created I
// should be able to login with my username and password. If a user register request is invalid a 400 error
// should be returned, if the user is already registered a conflict error should be returned.
// On login the users crendentials should be verified.
// Because we dont have a database in this environment we store the users in memory. Fill the helper functions
// to query the memory db.


/** Decode JSON data */
app.use(
  express.json()
);

// Request body -> UserDto
app.use(routes);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
