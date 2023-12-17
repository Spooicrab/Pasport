import { generateProduct } from "../faker.js"

class mockingControllers {

    mock = (req, res) => {
        try {
            const productArray = []

            for (let i = 0; i < 100; i++) {
                const product = generateProduct()
                productArray.push(product)
            }

            res.json(productArray)
        } catch (error) { console.log(error) }
    }
}

export const mockingController = new mockingControllers()