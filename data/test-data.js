const fakeBallots = [
  {
    id: 1,
    name: 'bookclub',
    adminCode: '1234',
    voteCode: null
  }
];

const fakeSuggestions = [
  {
    id: 1,
    username: 'bookperson123',
    title: 'The Fish Warrior',
    ballotId: 1,
    googleBooks: '7lLVCQAAQBAJ'
  },
  {
    id: 2,
    username: 'bookperson123',
    title: 'Crying in H-Mart',
    ballotId: 1,
    googleBooks: 'maBtDwAAQBAJ'
  },
  {
    id: 3,
    username: 'bookperson123',
    title: 'The Confederacy of Dunces',
    ballotId: 1,
    googleBooks: '-8CbDwAAQBAJ'
  }
];

const fakeVotes = [

  {
    username: 'daniella',
    ballotId: 1,
    id: 123,
    vote: '3 1 2'
  },
  {
    username: 'austin',
    ballotId: 1,
    id: 456,
    vote: '1 3 2'
  },

];

const fakeUsers = [

  {
    username: 'bookdude',
    password: 'iluvbooks'
  }
];

export { fakeVotes, fakeSuggestions, fakeBallots, fakeUsers };