/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:

import { fakeBallots, fakeSuggestions, fakeUsers } from './test-data.js';

run();

async function run() {

  try {

    const ballots = await Promise.all(
      fakeBallots.map(ballot => {
        return client.query(`
          INSERT INTO ballots (name, admin_code, vote_code)
          VALUES ($1, $2, $3)
          RETURNING id, name, admin_code as "adminCode", vote_code as "voteCode";
        `, [ballot.name, ballot.adminCode, ballot.voteCode]);
      })
    );

    const ballot = ballots[0].rows[0];

    const users = await Promise.all(
      fakeUsers.map(user => {
        return client.query(`
          INSERT INTO users (username, ballot_id, password)
          VALUES ($1, $2, $3)
          RETURNING id, username, password, ballot_id as "ballotId";
        `, [user.username, ballot.id, user.password]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      fakeSuggestions.map(suggestion => {
        return client.query(`
          INSERT INTO suggestions (user_id, ballot_id, google_books)
          VALUES ($1, $2, $3)
        `, [user.id, ballot.id, suggestion.googleBooks]);
      })
    );

    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}