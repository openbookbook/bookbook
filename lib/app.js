/* eslint-disable indent */
/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
// import ensureAuth from './auth/ensure-auth.js';
// import createAuthRoutes from './auth/create-auth-routes.js';
import ballotRoutes from './controllers/ballots.js';
import userRoutes from './controllers/users.js';

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
app.use('/api/ballots', ballotRoutes);

// users routes: POST, GET(ballotid), PUT, DELETE
app.use('/api/users', userRoutes);

// suggestions routes: POST, GET(ballot_id), PUT(id), DELETE(id)
app.post('/api/suggestions/', async (req, res) => {
  try {
    const suggestion = req.body;
    const data = await client.query(`
      INSERT INTO suggestions (ballot_id, user_id, google_books)
      VALUES ($1, $2, $3)
      RETURNING id, ballot_id as "ballotId", user_id as "userId", google_books as "googleBooks"
    `, [suggestion.ballotId, suggestion.userId, suggestion.googleBooks || suggestion.gbooks || suggestion.googleId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/:ballot_id/suggestions', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, ballot_id as "ballotId", user_id as "userId", google_books as "googleBooks"
      FROM suggestions
      WHERE ballot_id = $1;
    `, [req.params.ballot_id]);

    res.json(data.rows);
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
      SET ballot_id = $2, user_id = $3, google_books = $4
      WHERE id = $1
      RETURNING id, ballot_id as "ballotId", user_id as "userId", google_books as "googleBooks"
    `, [req.params.id, suggestion.ballotId, suggestion.userId, suggestion.googleBooks]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/suggestions/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM suggestions
      WHERE id = $1
      RETURNING id, ballot_id as "ballotId", user_id as "userId", google_books as "googleBooks"
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;