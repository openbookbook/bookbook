/* eslint-disable indent */
/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import ensureAuth from './auth/ensure-auth.js';
// import createAuthRoutes from './auth/create-auth-routes.js';
import ballotRoutes from './controllers/ballots.js';
import userRoutes from './controllers/users.js';
import suggestionRoutes from './controllers/suggestions.js';

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
app.use('/api/suggestions', suggestionRoutes);

export default app;