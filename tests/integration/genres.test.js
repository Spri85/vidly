const request = require('supertest');
const {
    Genre
} = require('../../models/genre');
const {
    User
} = require('../../models/user');

const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server = null;
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close(); //Close the server
        await Genre.remove({}); //clean up the DB
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([{
                    name: 'Genre1'
                },
                {
                    name: 'Genre2'
                }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({
                name: 'genre1'
            });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return a 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return a 404 if no Genre with given id exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({
                    name
                });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            await exec();

            const genre = await Genre.find({
                name: 'genre1'
            })
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {

        let token;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({
                    name: 'genreUpdated'
                });
        };

        beforeEach(() => {
            token = new User({
                name: 'newUser',
                isAdmin: true
            }).generateAuthToken();

        });

        it('should return 404 if not Genre with given ID exist', async () => {
            const id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if invalid Genre ID', async () => {
            const id = 'a';
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return updated genre', async () => {
            const genre = new Genre({
                name: 'genreOld'
            });
            await genre.save();

            id = genre._id;
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genreUpdated');

        });
    });

});