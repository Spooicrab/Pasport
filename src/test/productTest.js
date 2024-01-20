import supertest from 'supertest';
import config from '../config/config.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

const adminAgent = supertest.agent('http://localhost:8080');

describe('Products endpoints', () => {

    describe('GET /api/products', () => {
        it('Should return an array with products', async () => {
            const response = await adminAgent.get('/api/products/');
            expect(response.body.docs).to.be.an('array');
        });
    });

    describe('POST /api/products', () => {

        describe('Add Products', () => {

            const Product = {
                title: 'Rollo de cocina 3unid',
                description: 'Papel 50 paños, segunda marca',
                price: 111,
                thumbnail: "https://www.mayoristanet.com/media/catalog/product/cache/7c7e7e8fca0426f106cb3e3371a80f9c/A/0/A08137_5.JPG",
                code: 9123843,
                stock: 15
            };

            const adminLogin = {
                email: 'Coder@Admin.com',
                password: 'admin'
            };

            before(async () => {
                const response = await adminAgent
                    .post('/api/users/login')
                    .send(adminLogin);

                const cookieHeader = response.headers['set-cookie'][0];
                const [cookieName, cookieValue] = cookieHeader.split(';')[0].split('=');

                adminAgent.set('Cookie', `${cookieName}=${cookieValue}`);
            });

            it('debería agregar un producto con la cookie de admin', async () => {
                const response = await adminAgent
                    .post('/api/products/')
                    .send(Product);

                // console.log(response);

                expect(response.status).to.be.equal(200);
            });

            after(async () => {
                await adminAgent.get('/api/users/logout');
                await mongoose.connect(`${config.mongo_uri}`)
                await mongoose.connection.collection('products').deleteOne({ title: `${Product.title}` })
            });
        });
    });
});
