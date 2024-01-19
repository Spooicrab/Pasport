import supertest from 'supertest'
import { expect } from 'chai'

const requester = supertest('http://localhost:8080')

describe('Products endpoints', () => {

    describe('GET /api/products', () => {
        it('Should return an array with products', async () => {
            const response = await requester.get('/api/products/')
            expect(response._body.docs).to.be.an('array')
        })
    })



})