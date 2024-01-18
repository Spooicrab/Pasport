import supertest from 'supertest'
import { expect } from 'chai'

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
        email: 'JuanitOG@gmail.com',
        password: 'mfhvc739740W143AD4krh23gybfoth',
    }

    describe('POST /api/users/signup', () => {
        it('should create a user with github = false', async () => {
            const response = await requester.post('/api/users/signup').send(userRegister);
            console.log(response);
            expect(response.statusCode).to.be.equal(200)
            expect(response.body.github).to.be.false;
        });
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