/* eslint-disable indent */
/* eslint-disable no-console */
// import dependencies
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

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
// app.use('/api', ensureAuth);

// API routes:

app.post('/api/ballots', async (req, res) => {
  try {
    const ballot = req.body;
    const data = await client.query(`
    INSERT INTO ballots (admin_code, vote_code, name, end_date)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
    `, [ballot.adminCode, ballot.voteCode, ballot.name, ballot.endDate]);

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
    SET name = $1, admin_code = $2, vote_code = $3, end_date = $4
    WHERE id = $5
    RETURNING id, name, admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
    `, [ballot.name, ballot.adminCode, ballot.voteCode, ballot.endDate, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

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
    `,
      [req.params.id]);
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
    SELECT id, admin_code as "adminCode", name, vote_code as "voteCode", end_date as "endDate"
    FROM ballots
    WHERE id = $1
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/:ballotid/votes', async (req, res) => {
  try {
    const data = await client.query(`
    SELECT id, user_id as "userId", ballot_id as "ballotId", vote
    FROM votes
    WHERE ballot_id = $1
    `, [req.params.ballotid]);

    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/votes', async (req, res) => {
  try {
    const vote = req.body;
    const data = await client.query(`
    INSERT INTO votes (user_id, ballot_id, vote)
    VALUES ($1, $2, $3)
    RETURNING id, user_id as "userId", ballot_id as "ballotId", vote
    `, [vote.userId, vote.ballotId, vote.vote]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
    INSERT INTO users (username, ballot_id, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, ballot_id as "ballotId", password
    `, [user.username, user.ballotId, user.password]);

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
    SELECT id, username, ballot_id as "ballotId", password
    FROM users
    WHERE ballot_id = $1
    `, [req.params.ballotid]);

    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/votes/:id', async (req, res) => {
  try {
    const vote = req.body;
    const data = await client.query(`
    UPDATE votes
    SET user_id = $1, ballot_id = $2, vote = $3
    WHERE id = $4
    RETURNING id, user_id as "userId", ballot_id as "ballotId", vote;
    `, [vote.userId, vote.ballotId, vote.vote, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default app;