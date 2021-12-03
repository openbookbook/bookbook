/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {
  try {
    // run a query to create tables
    await client.query(` 
      CREATE TABLE clubs (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL
      );

      CREATE TABLE ballots  (
        id SERIAL PRIMARY KEY NOT NULL,
        club_id INTEGER REFERENCES clubs(id),
        name VARCHAR(512) NOT NULL,
        voting_method VARCHAR(512) NOT NULL DEFAULT 'default',
        candidate_type VARCHAR(512) DEFAULT 'book',
        admin_code VARCHAR(512) NOT NULL,
        vote_code VARCHAR(512) DEFAULT NULL,
        end_date VARCHAR(512) DEFAULT NULL
      );

      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        ballot_id INTEGER NOT NULL REFERENCES ballots(id),
        username VARCHAR(512) NOT NULL,
        password VARCHAR(512) DEFAULT NULL,
        vote VARCHAR(512)
      );

      CREATE TABLE suggestions (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id),
        ballot_id INTEGER NOT NULL REFERENCES ballots(id),
        description TEXT,
        google_books VARCHAR(512)
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
