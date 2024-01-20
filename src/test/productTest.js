import supertest from 'supertest';
import config from '../config/config.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

const adminAgent = supertest.agent('http://localhost:8080');
const premiumAgent = supertest.agent('http://localhost:8080');
const userAgent = supertest.agent('http://localhost:8080')


describe('Products endpoints', () => {

    describe('GET /api/products', () => {
        it('Should return an array with products', async () => {
            const response = await adminAgent.get('/api/products/');
            expect(response.body.docs).to.be.an('array');
        });
    });

    describe('POST /api/products', () => {

        describe('Add Products', () => {

            const adminProduct = {
                title: 'producto de admin',
                description: 'Producto descrip',
                price: 111,
                code: 111111,
                thumbnail: "kjhgvjsabdnacskoh",
                stock: 15
            };

            const premiumProduct = {
                title: 'producto de premium',
                description: 'Producto descrip',
                price: 111,
                code: 111111,
                thumbnail: "kjhgvjsabdnacskoh",
                stock: 15
            };

            const userLogin = {
                email: 'a@a',
                password: 'a'
            }

            const premiumLogin = {
                email: 'p@p',
                password: 'p'
            }

            const adminLogin = {
                email: 'Coder@Admin.com',
                password: 'admin'
            };

            before(async () => {
                const getAdmin = await adminAgent
                    .post('/api/users/login')
                    .send(adminLogin);

                const adminCookieHeader = getAdmin.headers['set-cookie'][0];
                const [adminCookieName, adminCookieValue] = adminCookieHeader.split(';')[0].split('=');

                adminAgent.set('Cookie', `${adminCookieName}=${adminCookieValue}`);

                // 

                const getPremium = await premiumAgent
                    .post('/api/users/login')
                    .send(premiumLogin);

                const premiumCookieHeader = getPremium.headers['set-cookie'][0];
                const [premiumCookieName, premiumCookieValue] = premiumCookieHeader.split(';')[0].split('=');

                premiumAgent.set('Cookie', `${premiumCookieName}=${premiumCookieValue}`);

                // 
                const response = await userAgent
                    .post('/api/users/login')
                    .send(userLogin);

                const userCookieHeader = response.headers['set-cookie'][0];
                const [userCookieName, userCookieValue] = userCookieHeader.split(';')[0].split('=');

                userAgent.set('Cookie', `${userCookieName}=${userCookieValue}`);

            });

            it('debería agregar un producto con la cookie de Premium', async () => {
                const response = await premiumAgent
                    .post('/api/products/')
                    .send(premiumProduct);

                expect(response.status).to.be.equal(200);
            });

            it('debería agregar un producto con la cookie de admin', async () => {
                const response = await adminAgent
                    .post('/api/products/')
                    .send(adminProduct);

                expect(response.status).to.be.equal(200);
            });

            it('no debería agregar un producto', async () => {
                const response = await userAgent
                    .post('/api/products/')
                    .send(premiumProduct);

                // console.log(response);

                expect(response.status).to.be.equal(403);
            });


            after(async () => {
                await adminAgent.get('/api/users/logout');
                await premiumAgent.get('/api/users/logout');

                await mongoose.connect(`${config.mongo_uri}`)
                await mongoose.connection.collection('products').deleteOne({ title: `${adminProduct.title}` })
                await mongoose.connection.collection('products').deleteOne({ title: `${premiumProduct.title}` })

            });
        });
    });
});
