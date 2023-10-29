import express from 'express';
import request from 'supertest';
import { CustomError } from '../../errors/customError.js';
import { timestampRouter } from '../../routes/timestampRouter.js';

describe('timestampRouter', () => {
  const app = express();
  app.use(timestampRouter);

  describe('GET /api/:date?', () => {
    it('should return the current timestamp when no date parameters is provided', async () => {
      const response = await request(app).get('/api');

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('unix');
      expect(response.body).toHaveProperty('utc');
    });

    it('should return the timestamp and UTC date for a valid numeric date parameter', async () => {
      const validTimestamp = 1451001600000;
      const response = await request(app).get(`/api/${validTimestamp}`);
      const date = new Date(validTimestamp);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('unix', date.getTime());
      expect(response.body).toHaveProperty('utc', date.toUTCString());
    });

    it('should return the timestamp and UTC date for a valid date string parameter', async () => {
      const validDateString = 'Fri, 25 Dec 2015 00:00:00 GMT';
      const response = await request(app).get(`/api/${validDateString}`);
      const date = new Date(validDateString);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('unix', date.getTime());
      expect(response.body).toHaveProperty('utc', date.toUTCString());
    });

    it('should return a 400 error for an invalid date parameter', async () => {
      const invalidDate = 'not_a_valid_date';
      const response = await request(app).get(`/api/${invalidDate}`);

      expect(response.status).toBe(400);
    });
  });
});
