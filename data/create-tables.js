/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        username VARCHAR(512) NOT NULL,
        ballot_id INTEGER NOT NULL REFERENCES ballots(id),
        password VARCHAR(512) DEFAULT NULL
      );
    
      CREATE TABLE ballots  (
        id SERIAL PRIMARY KEY NOT NULL,
        admin_code VARCHAR(512) NOT NULL,
        name VARCHAR(512) NOT NULL,
        vote_code VARCHAR(512) DEFAULT NULL
      );

      CREATE TABLE suggestions (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id),
        ballot_id INTEGER NOT NULL REFERENCES ballots(id),
        gbooks VARCHAR(512) NOT NULL
      );

      CREATE TABLE votes (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        ballot_id INTEGER NOT NULL REFERENCES ballots(id),
        vote VARCHAR(512) NOT NULL
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}