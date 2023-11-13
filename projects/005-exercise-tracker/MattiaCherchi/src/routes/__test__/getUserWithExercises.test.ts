import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';
import { Exercise } from '../../models/Exercise';
import mongoose from 'mongoose';

describe('GET /api/users/:_id/logs', () => {
  it('should return 200 with user exercises', async () => {
    const user = User.build({ username: 'test-user' });
    await user.save();

    const exercise_1 = Exercise.build({
      username: user.username,
      description: 'Exercise 1',
      duration: 30,
      date: new Date('2023-11-12'),
    });

    const exercise_2 = Exercise.build({
      username: user.username,
      description: 'Exercise 2',
      duration: 45,
    });

    await exercise_1.save();
    await exercise_2.save();

    const response = await request(app).get(`/api/users/${user._id}/logs`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', user.username);
    expect(response.body).toHaveProperty('count', 2);
    expect(response.body).toHaveProperty('_id', user.id);
    expect(response.body).toHaveProperty('logs');
    expect(response.body.logs).toHaveLength(2);

    expect(response.body.logs[0]).toHaveProperty(
      'description',
      exercise_2.description
    );
    expect(response.body.logs[0]).toHaveProperty(
      'duration',
      exercise_2.duration
    );
    expect(response.body.logs[0]).toHaveProperty(
      'date',
      exercise_2.date?.toDateString()
    );

    expect(response.body.logs[1]).toHaveProperty(
      'description',
      exercise_1.description
    );
    expect(response.body.logs[1]).toHaveProperty(
      'duration',
      exercise_1.duration
    );
    expect(response.body.logs[1]).toHaveProperty(
      'date',
      exercise_1.date?.toDateString()
    );
  });

  it('should return 200 with user exercises using valid query string', async () => {
    const user = User.build({ username: 'test-user' });
    await user.save();

    const exercise_1 = Exercise.build({
      username: user.username,
      description: 'Exercise 1',
      duration: 30,
      date: new Date('2023-01-01'),
    });
    const exercise_2 = Exercise.build({
      username: user.username,
      description: 'Exercise 2',
      duration: 30,
      date: new Date('2023-02-01'),
    });
    const exercise_3 = Exercise.build({
      username: user.username,
      description: 'Exercise 3',
      duration: 30,
      date: new Date('2023-03-01'),
    });

    await exercise_1.save();
    await exercise_2.save();
    await exercise_3.save();

    const response = await request(app)
      .get(`/api/users/${user._id}/logs`)
      .query({ from: '2023-01-01', to: '2023-03-01', limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', user.username);
    expect(response.body).toHaveProperty('count', 2);
    expect(response.body).toHaveProperty('_id', user.id);
    expect(response.body).toHaveProperty('logs');
    expect(response.body.logs).toHaveLength(2);

    expect(response.body.logs[0]).toHaveProperty(
      'description',
      exercise_3.description
    );
    expect(response.body.logs[0]).toHaveProperty(
      'duration',
      exercise_3.duration
    );
    expect(response.body.logs[0]).toHaveProperty(
      'date',
      exercise_3.date?.toDateString()
    );

    expect(response.body.logs[1]).toHaveProperty(
      'description',
      exercise_2.description
    );
    expect(response.body.logs[1]).toHaveProperty(
      'duration',
      exercise_2.duration
    );
    expect(response.body.logs[1]).toHaveProperty(
      'date',
      exercise_2.date?.toDateString()
    );
  });

  it('should handle invalid user id and return 400 with an error message', async () => {
    const invalidId = '2515622';
    const response = await request(app).get(`/api/users/${invalidId}/logs`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Invalid id');
  });

  it('should handle not found user and return 404 with an error message', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).get(
      `/api/users/${nonExistentUserId}/logs`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Resource Not Found');
  });

  it('should handle server error and return 500 with message', async () => {
    jest.spyOn(Exercise, 'aggregate').mockImplementation(() => {
      throw new Error('Mocked error during aggregation');
    });

    const user = User.build({ username: 'test-user' });
    await user.save();
    const response = await request(app).get(`/api/users/${user._id}/logs`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Something went wrong');
  });
});
