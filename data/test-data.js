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
    suggestion: '7lLVCQAAQBAJ'
  },
  {
    id: 2,
    username: 'bookperson123',
    title: 'Crying in H-Mart',
    ballotId: 1,
    suggestion: 'maBtDwAAQBAJ'
  },
  {
    id: 3,
    username: 'bookperson123',
    title: 'The Confederacy of Dunces',
    ballotId: 1,
    suggestion: '-8CbDwAAQBAJ'
  }
];

const fakeUsers = [
  {
    username: 'bookdude',
    password: 'iluvbooks'
  }
];

export { fakeSuggestions, fakeBallots, fakeUsers };