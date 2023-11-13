import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';

describe('POST /api/users', () => {
  it('should create a new user when username is unique and has at least 3 characters', async () => {
    const username = 'test-user';
    const response = await request(app).post('/api/users').send({ username });

    expect(response.status).toEqual(201);
    expect(response.body.username).toEqual(username);
  });

  it('should return 400 if username is less than 3 characters', async () => {
    const username = 'ab';
    const response = await request(app).post('/api/users').send({ username });

    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toEqual(
      'The username must contain at least 3 characters'
    );
  });

  it('should return 400 if user already exists', async () => {
    const username = 'existing-user';
    await request(app).post('/api/users').send({ username });

    // Try to create another user with the same username
    const response = await request(app).post('/api/users').send({ username });

    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toEqual(
      `user: ${username} already exists`
    );
  });

  it('should return 500 is an error occurs during user creation', async () => {
    const username = 'test-user';
    jest.spyOn(User, 'build').mockImplementation(() => {
      throw new Error('Mocked error during user creation');
    });

    const response = await request(app).post('/api/users').send({ username });

    expect(response.status).toEqual(500);
    expect(response.body.errors[0].message).toEqual(
      'An error occurred while creating the user'
    );
  });
});
