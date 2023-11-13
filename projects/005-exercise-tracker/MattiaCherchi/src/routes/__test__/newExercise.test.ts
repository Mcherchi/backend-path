import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';
import { Exercise } from '../../models/Exercise';
import mongoose from 'mongoose';

describe('POST /api/users/:_id/exercises', () => {
  it('should return 200 and create an exercise', async () => {
    const username = 'test-user';

    const user = User.build({ username });
    await user.save();

    const response = await request(app)
      .post(`/api/users/${user._id}/exercises`)
      .send({
        description: 'Test exercise',
        duration: 30,
        date: '2023-01-01',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'test-user');
    expect(response.body).toHaveProperty('description', 'Test exercise');
    expect(response.body).toHaveProperty('duration', 30);
    expect(response.body).toHaveProperty('date', 'Sun Jan 01 2023');
    expect(response.body).toHaveProperty('_id', user.id);

    //Check that the exercise has been saved in the database

    const savedExercise = await Exercise.findOne({ username });
    expect(savedExercise).toBeTruthy();
    expect(savedExercise?.description).toEqual('Test exercise');
  });

  it('should handle validation errors and return 400 with an error message ', async () => {
    const username = 'test-user';

    const user = User.build({ username });
    await user.save();

    const response = await request(app)
      .post(`/api/users/${user._id}/exercises`)
      .send({
        // The 'duration' field is missing
        description: 'Invalid exercise',
        date: '2023-01-01',
      });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual(
      'The duration field is required and must be a number.'
    );
  });

  it('should handle invalid user id and return 400 with an error message', async () => {
    const invalidId = '2564125';
    const response = await request(app)
      .post(`/api/users/${invalidId}/exercises`)
      .send({
        description: 'Test exercise',
        duration: 30,
        date: '2023-01-01',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Invalid id');
  });

  it('should handle not found user and return 404 with an error message', async () => {
    const nonExistingUserId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
      .post(`/api/users/${nonExistingUserId}/exercises`)
      .send({
        description: 'Test exercise',
        duration: 30,
        date: '2023-01-01',
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual('Resource Not Found');
  });

  it('should handle server error and return 500 with an error message', async () => {
    jest.spyOn(Exercise, 'build').mockImplementation(() => {
      throw new Error('Mocked error during saving exercise');
    });

    const user = User.build({ username: 'test-user' });
    await user.save();

    const response = await request(app)
      .post(`/api/users/${user._id}/exercises`)
      .send({
        description: 'Test exercise',
        duration: 30,
        date: '2023-01-01',
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].message).toEqual(
      'Error in adding the exercise.'
    );
  });
});
