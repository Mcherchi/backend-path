import request from 'supertest';
import { Url } from '../../models/Url';
import { app } from '../../app';

describe('GET /shorturl/:short_url', () => {
  it('should return the original URL for a valid short URL', async () => {
    const url_1 = Url.build({
      original_url: 'http://www.example.com',
      short_url: 'abc123',
    });
    await url_1.save();

    const response = await request(app).get(`/api/shorturl/${url_1.short_url}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('original_url', url_1.original_url);
  });

  it('should respond with an error for an invalid short URL', async () => {
    const response = await request(app).get('/api/shorturl/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Resource Not Found');
  });
});

describe('GET /shorturl', () => {
  it('should return a list of all URLs', async () => {
    const url_1 = Url.build({
      original_url: 'http://www.example1.com',
      short_url: 'abc123',
    });
    await url_1.save();

    const url_2 = Url.build({
      original_url: 'http://www.example2.com',
      short_url: 'def456',
    });
    await url_2.save();

    const response = await request(app).get('/api/shorturl');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('original_url', url_1.original_url);
    expect(response.body[0]).toHaveProperty('short_url', url_1.short_url);
    expect(response.body[1]).toHaveProperty('original_url', url_2.original_url);
    expect(response.body[1]).toHaveProperty('short_url', url_2.short_url);
  });
});
