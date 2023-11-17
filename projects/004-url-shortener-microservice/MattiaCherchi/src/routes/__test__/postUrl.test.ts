import request from 'supertest';
import { app } from '../../app';
import { Url } from '../../models/Url';

describe('POST /shorturl', () => {
  it('should respond with a short URL for a valid input', async () => {
    const validUrl = 'http://www.example.com';

    const response = await request(app)
      .post('/api/shorturl')
      .send({ original_url: validUrl });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('original_url', validUrl);
    expect(response.body).toHaveProperty('short_url');
  });

  it('should respond with an error for an invalid URL', async () => {
    const invalidUrl = 'invalid_url';

    const response = await request(app)
      .post('/api/shorturl')
      .send({ original_url: invalidUrl });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Invalid URL');
  });

  it('should respond with an error for an unreachable URL ', async () => {
    const unreachableUrl = 'http://www.example';

    const response = await request(app)
      .post('/api/shorturl')
      .send({ original_url: unreachableUrl });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual(
      `URL ${unreachableUrl} is not reachable`
    );
  });

  it('should respond with an error for an existing URL', async () => {
    const existingUrl = 'http://www.example.com';

    await request(app)
      .post('/api/shorturl')
      .send({ original_url: existingUrl });

    const response = await request(app)
      .post('/api/shorturl')
      .send({ original_url: existingUrl });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual(
      `${existingUrl}: Already exists`
    );
  });

  it('should return 500 is an error occurs during URL creation', async () => {
    const url = 'http://www.example.com';

    jest.spyOn(Url, 'build').mockImplementation(() => {
      throw new Error('Mocked error during URL creation');
    });

    const response = await request(app)
      .post('/api/shorturl')
      .send({ original_url: url });

    expect(response.status).toBe(500);
    expect(response.body.errors[0].message).toEqual('Something went wrong');
  });
});
