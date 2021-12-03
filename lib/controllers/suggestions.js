/* eslint-disable no-console */
import { Router } from 'express';
import Suggestion from '../models/Suggestion.js';
// import client from '../client.js';

const suggestionRoutes = Router()
  .post('/', async (req, res) => {
    try {
      const suggestion = req.body;
      const data = await Suggestion.create(suggestion);

      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })
  .get('/', async (req, res) => {
    try {
      const { ballot } = req.query;
      const data = await Suggestion.findBy(ballot, 'ballot_id');

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })
  .put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const suggestion = req.body;
      const data = await Suggestion.update(id, suggestion);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })
  .patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const key = req.body.key || req.query.key || 'suggestion';
      const value = req.body.value || req.query.value;
      const data = await Suggestion.patch(id, value, key);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Suggestion.delete(id);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })
;

export default suggestionRoutes;
