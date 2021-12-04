/* eslint-disable no-console */
import { Router } from 'express';
import client from '../client.js';
import User from '../models/User.js';

const userRoutes = Router()
  .post('/', async (req, res) => {
    try {
      const user = req.body;
      const data = await client.query(`
        INSERT INTO users (ballot_id, username, password, vote)
        VALUES ($1, $2, $3, $4)
        RETURNING id, ballot_id as "ballotId", username, password, vote;
      `, [user.ballotId, user.username, user.password, user.vote]);
  
      res.status(201).json(data.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .post('/:id/login', async (req, res) => {
    const { id } = req.params;
    try {
      const { password } = req.body;
      const data = await client.query(`
        SELECT * FROM users
        WHERE id = $1;
      `, [id]);
      const user = data.rows[0];

      if (user.password === password) {
        res.status(200).json({
          ...user,
          password: Boolean(user.password),
          ballotId: user.ballotId
        });
      } else throw new Error('Invalid password');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .get('/', async (req, res) => {
    try {
      const { ballot } = req.query;
      const data = await client.query(`
        SELECT id, ballot_id as "ballotId", username, password, vote
        FROM users
        WHERE ballot_id = $1;
      `, [ballot]);

      res.status(200).json(data.rows.map(user => ({
        ...user,
        password: Boolean(user.password)
      })));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { ballotId, username, password, vote } = req.body;
      const data = await client.query(`
        UPDATE users
        SET ballot_id = $1, username = $2, password = $3, vote = $4
        WHERE id = $5
        RETURNING id, ballot_id as "ballotId", username, vote;
      `, [ballotId, username, password, vote, id]);

      res.status(200).json(data.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .patch('/:id', async (req, res) => {
    const { id } = req.params;

    console.log(req.body);
    try {
      const [key, val] = req.body;
      console.log(key, val);
      const data = await User.patch(id, val, key);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = await client.query(`
        DELETE FROM users
        WHERE id = $1
        RETURNING id, ballot_id as "ballotId", username, vote;
      `, [id]);

      res.status(200).json(data.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  })
;

export default userRoutes;
