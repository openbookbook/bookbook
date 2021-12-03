class Ballot {
  constructor({ id, club_id, name, voting_method, candidate_type, admin_code, vote_code, end_date }) {
    this.id = id;
    this.clubId = club_id;
    this.name = name;
    this.votingMethod = voting_method;
    this.candidateType = candidate_type;
    this.adminCode = admin_code;
    this.voteCode = vote_code;
    this.endDate = end_date;
  }
}

export default Ballot;
