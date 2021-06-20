import { Router } from 'express';

export default Router()
  .post('/api/ballots', async (req, res) => {
    try {
      const ballot = req.body;
      const data = await client.query(`
        INSERT INTO ballots (club_id, name, voting_method, admin_code, vote_code, end_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, club_id as "clubId", name, voting_method as "votingMethod", admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
      `, [ballot.clubId, ballot.name, ballot.votingMethod, ballot.adminCode, ballot.voteCode, ballot.endDate]);
  
      res.json(data.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  })
  .get('/api/ballots/:id', async (req, res) => {
    try {
      const data = await client.query(`
        SELECT id, club_id as "clubId", name, voting_method as "votingMethod", admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate"
        FROM ballots
        WHERE id = $1;
      `, [req.params.id]);

      res.json(data.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  })
  .put('/api/ballots/:id', async (req, res) => {
    try {
      const ballot = req.body;
      const data = await client.query(`
        UPDATE ballots
        SET club_id = $1, name = $2, voting_method = $3, admin_code = $4, vote_code = $5, end_date = $6
        WHERE id = $1
        RETURNING id, club_id as "clubId", name, voting_method as "votingMethod", admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
      `, [req.params.id, ballot.clubId, ballot.name, ballot.votingMethod, ballot.adminCode, ballot.voteCode, ballot.endDate]);
  
      res.json(data.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  })
  .delete('/api/ballots/:id', async (req, res) => {
    try {
      const data = await client.query(`
        DELETE FROM ballots
        WHERE id = $1
        RETURNING id, club_id as "clubId", name, voting_method as "votingMethod", admin_code as "adminCode", vote_code as "voteCode", end_date as "endDate";
      `, [req.params.id]);

      res.json(data.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  })
;
