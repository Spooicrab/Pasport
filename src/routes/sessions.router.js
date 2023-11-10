import { Router } from "express";

const session = Router()

session.get("/githubsignup", async (req, res) => { //Creo esta ruta porque me da algun tipo de error  relacionado con querys usando la ruta '/products' con passport
    res.redirect('allproducts')
})



session.get('/error',
    async (req, res) => {
        res.render('error')
    }
)

export default session