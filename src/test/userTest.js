import supertest from 'supertest'
import { expect } from 'chai'
import mongoose from 'mongoose'
import config from '../config/config.js'

const requester = supertest('http://localhost:8080')

describe('user endopoints', () => {
    const userRegister = {
        first_name: 'Juan',
        last_name: 'Gonzales',
        email: 'JuanitOG@gmail.com',
        age: 33,
        password: 'mfhvc739740W143AD4krh23gybfoth'
    }

    const userLogin = {
        email: userRegister.email,
        password: userRegister.password,
    }

    const premiumLogin = {
        email: 'p@p',
        password: 'p'
    }

    const adminLogin = {
        email: 'Coder@Admin.com',
        password: 'admin'
    }

    describe('POST /api/users/signup', () => {
        it('should create a user with github = false', async () => {
            const response = await requester.post('/api/users/signup').send(userRegister)
            expect(response._body.Github).to.be.false;
        });
    })

    describe('POST /api/users/login', () => {
        it('should redirect to admin view', async () => {
            const response = await requester.post('/api/users/login')
                .send(adminLogin);
            // console.log(response)
            // const cookieName = response.headers['set-cookie'][0].split('=')[0]
            // const cookieValue = response.headers['set-cookie'][0].split('=')[1].split(';')[0];
            // console.log('cookienameeeeeee', cookieName);
            // console.log('cookievalueeeeeeee', cookieValue);
            expect(response.header.location).to.be.equal('/views/admin')

        });

        it('should redirect to userView with the same user registered previously', async () => {
            const response = await requester.post('/api/users/login')
                .send(userLogin);
            expect(response.header.location).to.be.equal('/views/products')
        });

        it('should redirect to premium view', async () => {
            const response = await requester.post('/api/users/login')
                .send(premiumLogin);
            expect(response.header.location).to.be.equal('/views/premium')
        });

        after(async function () {
            await mongoose.connect(`${config.mongo_uri}`)
            await mongoose.connection.collection('users').deleteOne({ email: `${userRegister.email}` })
        })

    })

    // describe('POST /api/users/login', () => {
    //     it('should return a jwt', async () => {
    //         const response = await requester
    //             .post('api/users/login')
    //             .send(userLogin)

    //         console.log(response);

    //     })
    // })
})