import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
// import { execSync } from 'child_process';

const request = supertest(app);

// describe.skip('API Routes', () => {

afterAll(async () => {
  return client.end();
});

//   describe('/api/cats', () => {
//     let user;

//     beforeAll(async () => {
//       execSync('npm run recreate-tables');

//       const response = await request
//         .post('/api/auth/signup')
//         .send({
//           name: 'Me the User',
//           email: 'me@user.com',
//           password: 'password'
//         });

//       expect(response.status).toBe(200);

//       user = response.body;
//     });

// append the token to your requests:
//  .set('Authorization', user.token);
let ballot = {
  name: 'Jeffs BookClub',
  adminCode: '123',
  voteCode: '123',
  id: expect.any(Number)
};

let updatedBallot = {
  name: 'Geoffs BookClub',
  adminCode: '1234',
  voteCode: null,
  id: 3
};

let suggestion = {
  id: expect.any(Number),
  userId: 5,
  ballotId: 1,
  gbooks: '6g234g21'
};

let user = {
  id: expect.any(Number),
  username: 'bookbookbookclub',
  ballotId: 1,
  password: '1234'
};

let vote = {
  id: expect.any(Number),
  userId: 5,
  ballotId: 1,
  vote: '6g234g21'
};

it('POST Ballot to /api/ballots', async () => {
  const response = await request
    .post('/api/ballots')
    .send(ballot);


  expect(response.status).toBe(200);
  expect(response.body).toEqual(ballot);

});

it('PUT/UPDATE ballot from /api/ballots/:id', async () => {
  const response = await request
    .put('/api/ballots/3')
    .send(updatedBallot);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedBallot);

});

it('POST user to /api/users', async () => {
  const response = await request
    .post('/api/users')
    .send(user);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(user);

});

it('POST suggestions to /api/suggestions/', async () => {
  const response = await request
    .post('/api/suggestions/')
    .send(suggestion);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(suggestion);
});

it('GET ballot by id to /api/ballots/:id', async () => {
  const response = await request
    .get('/api/ballots/3')
    .send(updatedBallot);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedBallot);
});

it('GET ballot by id to /api/ballots/:id', async () => {
  const response = await request
    .get('/api/ballots/3')
    .send(updatedBallot);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedBallot);
});

it('POST vote to /api/votes', async () => {
  const response = await request
    .post('/api/votes')
    .send(vote);
  expect(response.status).toBe(200);
  expect(response.body).toEqual([vote]);
});


//   });
// });