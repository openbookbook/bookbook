/* eslint-disable indent */
/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
// import ensureAuth from './auth/ensure-auth.js';
// import createAuthRoutes from './auth/create-auth-routes.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
// app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('bookbook thing');
});

// club routes: POST, GET(id), PUT(id), DELETE(id)

// ballots routes: POST, GET(id), GET(club_id), PUT(id), DELETE(id)
app.post('/api/ballots', async (req, res) => {
  try {
    const ballot = req.body;
    const data = await client.query(`
      INSERT INTO ballots (club_id, name, admin_code, vote_code, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, club_id as "clubId", name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
    `, [ballot.clubId, ballot.name, ballot.adminCode, ballot.voteCode, ballot.endDate]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ballots/:id', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, club_id as "clubId", name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate"
      FROM ballots
      WHERE id = $1;
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/ballots/:id', async (req, res) => {
  try {
    const ballot = req.body;
    const data = await client.query(`
      UPDATE ballots
      SET club_id = $1, name = $2, admin_code = $3, vote_code = $4, end_date = $5
      WHERE id = $6
      RETURNING id, club_id as "clubId", name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
    `, [ballot.clubId, ballot.name, ballot.adminCode, ballot.voteCode, ballot.endDate, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ballots/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM ballots
      WHERE id = $1
      RETURNING id, club_id as "clubId", name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// users routes: POST, GET(ballotid), PUT, DELETE
app.post('/api/users', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (ballot_id, username, password, vote)
      VALUES ($1, $2, $3, $4)
      RETURNING id, ballot_id as "ballotId", username, password, vote;
    `, [user.ballotId, user.username, user.password, user.vote]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/:ballotid/users', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, ballot_id as "ballotId", username, password, vote
      FROM users
      WHERE ballot_id = $1;
    `, [req.params.ballotid]);

    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      UPDATE users
      SET ballot_id = $1, username = $2, password = $3, vote = $4
      WHERE id = $5
      RETURNING id, ballot_id as "ballotId", username, password, vote;
    `, [user.ballotId, user.username, user.password, user.vote, req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM users
      WHERE id = $1
      RETURNING id, ballot_id as "ballotId", username, password, vote;
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// suggestions routes: GET(ballot_id), POST, DELETE(id), PUT(id)
app.get('/api/:ballotid/suggestions', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, user_id as "userId", ballot_id as "ballotId", gbooks
      FROM suggestions
      WHERE ballot_id = $1
    `, [req.params.ballotid]);

    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/suggestions/', async (req, res) => {
  try {
    const suggestion = req.body;
    const data = await client.query(`
      INSERT INTO suggestions (user_id, ballot_id, gbooks)
      VALUES ($1, $2, $3)
      RETURNING id, user_id as "userId", ballot_id as "ballotId", gbooks
    `, [suggestion.userId, suggestion.ballotId, suggestion.gbooks]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/suggestions/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM suggestions
      WHERE id = $1
      RETURNING id, user_id as "userId", ballot_id as "ballotId", gbooks;
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/suggestions/:id', async (req, res) => {
  try {
    const suggestion = req.body;
    const data = await client.query(`
      UPDATE suggestions
      SET
      WHERE
      RETURNING 
    `, []);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;