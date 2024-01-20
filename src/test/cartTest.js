import supertest from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../config/config.js'

const requester = supertest('http://localhost:8080')


describe('Products endpoints', () => {

    let Id

    describe('GET /api/carts', () => {
        it('Should return an array with carts', async () => {
            const response = await requester.get('/api/carts/');
            // console.log(response);
            expect(response._body).to.be.an('array');
        });

    });

    describe('POST /api/carts', () => {

        it('Should return an empty cart', async () => {
            const response = await requester.post('/api/carts')
            // console.log(response);
            Id = response._body.add._id
            expect(response._body.add.Products).to.be.an('array').that.is.empty;

        })

        it('should bring ONE cart', async () => {
            const response = await requester.get(`/api/carts/${Id}`)
            expect(response.body).to.be.an('object')

        })

        after(async () => {

            await mongoose.connect(`${config.mongo_uri}`)
            await mongoose.connection.collection('carts').deleteOne({ _id: `${Id}` })

        });
    });
})