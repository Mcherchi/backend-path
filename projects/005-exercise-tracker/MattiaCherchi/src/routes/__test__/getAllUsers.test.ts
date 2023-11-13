import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';

describe('GET /api/users', () => {
  it('should return 200 and an array of users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 500 is an error occurs during fetching users', async () => {
    jest.spyOn(User, 'find').mockImplementation(() => {
      throw new Error('Mocked error during fetching users');
    });

    const response = await request(app).get('/api/users');

    expect(response.status).toEqual(500);
    expect(response.body.errors[0].message).toEqual(
      'An error occurred while fetching users'
    );
  });
});
