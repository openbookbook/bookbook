import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api', () => {
    // let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      // const response = await request
      //   .post('/api/auth/signup')
      //   .send({
      //     name: 'Me the User',
      //     email: 'me@user.com',
      //     password: 'password'
      //   });

      // expect(response.status).toBe(200);

      // user = response.body;
    });

    // append the token to your requests:
    //  .set('Authorization', user.token);
    let ballot = {
      name: 'Jeffs BookClub',
      adminCode: '123',
      voteCode: '123',
      id: expect.any(Number)
    };

    // let updatedBallot = {
    //   name: 'Geoffs BookClub',
    //   adminCode: '123',
    //   voteCode: '123',
    //   id: expect.any(Number)
    // };

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

      ballot = response.body;
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ballot);

    });

    it('PUT/UPDATE ballot from /api/ballots/:id', async () => {
      const response = await request
        .post('/api/ballots/')
        .send(ballot);
      ballot = response.body;
      ballot.name = 'Geoffs BookClub';
      const response2 = await request
        .put(`/api/ballots/${ballot.id}`)
        .send(ballot);
      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(ballot);

    });

    it('POST user to /api/users', async () => {
      const response = await request
        .post('/api/users')
        .send(user);
      user = response.body;
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);

    });

    it('POST suggestions to /api/suggestions/', async () => {
      suggestion.ballotId = ballot.id;
      suggestion.userId = user.id;
      const response = await request
        .post('/api/suggestions')
        .send(suggestion);
      suggestion = response.body;
      expect(response.status).toBe(200);
      expect(response.body).toEqual(suggestion);
    });

    it('GET ballot by id to /api/ballots/:id', async () => {
      const response = await request
        .get(`/api/ballots/${ballot.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ballot);
    });

    it('POST vote to /api/votes', async () => {
      vote.ballotId = ballot.id;
      vote.userId = user.id;
      const response = await request
        .post('/api/votes')
        .send(vote);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(vote);
    });

    it('DELETE suggestion to /api/suggestions/:id', async () => {
      const response = await request
        .delete(`/api/suggestions/${suggestion.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(suggestion);
    });


  });
});