import client from '../client.js';

class User {
  constructor({ id, ballot_id, username, password, vote }) {
    this.id = id;
    this.ballotId = ballot_id;
    this.username = username;
    this.password = password;
    this.vote = vote;
  }

  static async patch(id, value, key = 'vote') {
    const data = await client.query(`
      UPDATE users
      SET ${key} = $1
      WHERE id = $2
      RETURNING *;
    `, [value, id]);

    return new User(data.rows[0]);
  }
}

export default User;
