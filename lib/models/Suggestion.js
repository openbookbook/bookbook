import client from '../client.js';

class Suggestion {
  constructor({ id, user_id, ballot_id, suggestion }) {
    this.id = id;
    this.userId = user_id;
    this.ballotId = ballot_id;
    this.suggestion = suggestion;
  }

  static async create({ userId, ballotId, suggestion }) {
    const data = await client.query(`
      INSERT INTO suggestions (user_id, ballot_id, suggestion)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [userId, ballotId, suggestion]);

    return new Suggestion(data.rows[0]);
  }

  static async createMany(suggestions) {
    return await Promise.all(
      suggestions.map(suggestion => Suggestion.create(suggestion))
    );
  }

  static async findBy(query, key = 'id', onlyOne = false) {
    const data = await client.query(`
      SELECT * FROM suggestions
      WHERE ${key} = ${query};
    `);

    return onlyOne 
      ? new Suggestion(data.rows[0])
      : data.rows.map(row => new Suggestion(row))
    ;
  }

  static async update(id, { ballotId, userId, suggestion }) {
    const data = await client.query(`
      UPDATE suggestions
      SET 
        ballot_id = $1,
        user_id = $2,
        suggestion = $3
      WHERE id = $4
      RETURNING *;
    `, [id, ballotId, userId, suggestion]);

    return new Suggestion(data.rows[0]);
  }

  static async patch(id, value, key = 'suggestion') {
    const data = await client.query(`
      UPDATE suggestions
      SET ${key} = $1
      WHERE id = $2
      RETURNING *;
    `, [value, id]);

    return new Suggestion(data.rows[0]);
  }

  static async delete(id) {
    const data = await client.query(`
      DELETE FROM suggestions
      WHERE id = $1
      RETURNING *;
    `, [id]);

    return new Suggestion(data.rows[0]);
  }
}

export default Suggestion;