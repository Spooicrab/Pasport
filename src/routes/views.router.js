import { Router } from "express";
import { ProductManager } from "../dao/mongo/ProductManager.js";
import { CartM } from "../dao/mongo/CartManager.js";
const ViewsRouter = Router()

ViewsRouter.get("/products", async (req, res) => {
    let Productos = await ProductManager.GetAll(req.query)
    res.render('allproducts', (
        {
            Productos,
            first_name: req.user.first_name,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }
    ))
})


ViewsRouter.get("/productsPassport", async (req, res) => { //Creo esta ruta porque me da algun tipo de error  relacionado con querys usando la ruta '/products' con passport
    let Productos = await ProductManager.GetAllP()
    res.render('Productos', (
        {
            Productos
        }
    ))
})

ViewsRouter.get("/cart/:cid",
    async (req, res) => {
        const { cid } = req.body
        try {
            const cartid = await CartM.GetByID(cid)
            console.log(cartid)
            res.render('cartId', ({ cartid }))
        } catch (error) { res.status(500).json(error) }
    })

ViewsRouter.post("/products",
    async (req, res) => {
        const { title, description, price, stock, code, thumbail, } = req.body;
        if (!title || !price || !code || !stock) {
            return res.status(400).json({ message: "Faltan datos" })
        }
        if (!stock) {
            delete req.body.stock;
        }
        try {
            const Add = await ProductManager.Add(req.body);
            res
                .status(200)
                .json({ message: "Añadido", product: Add });
        } catch (err) { res.status(500).json({ error: err.message }) }
    });

ViewsRouter.get("/login",
    async (req, res) => {
        res.render('login')
    }
)

ViewsRouter.get("/test",
    async (req, res) => {
        res.render('test', { first_name: req.user.first_name })
    }
)

ViewsRouter.get('/error',
    async (req, res) => {
        res.render('error')
    }
)


ViewsRouter.get('/signup',
    async (req, res) => {
        res.render('registro')
    }
)

export default ViewsRouter