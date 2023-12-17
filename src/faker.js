import { faker } from "@faker-js/faker";

export const generateProduct = () => {

    const producto =
    {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 1, max: 30, dec: 0 }),
        thumbnail: faker.finance.bitcoinAddress(),
        code: faker.finance.creditCardCVV(),
        stock: faker.string.numeric(2),
    }

    return producto
}


