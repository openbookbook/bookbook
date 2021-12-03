class User {
  constructor({ id, ballot_id, username, password, vote }) {
    this.id = id;
    this.ballotId = ballot_id;
    this.username = username;
    this.password = password;
    this.vote = vote;
  }
}

export default User;
