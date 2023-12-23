import { ProductsService } from "../services/Product.services.js"
import { CartService } from "../services/Cart.services.js"
import { ChatService } from "../services/Chat.services.js"
import { Cookie } from "express-session"

class ViewController {

    Home =
        async (req, res) => {
            let Productos = await ProductsService.GetAll(req.query)
            let messages = await ChatService.find()
            res.render('allproducts', (
                {
                    messages,
                    Productos,
                    first_name: req.user.first_name,
                    email: req.user.email,
                    role: req.user.role,
                    cart: req.user.cart._id
                }
            ))
        }

    Carrito =
        async (req, res) => {
            const { cid } = req.params
            try {
                let cartid = await CartService.findByID(cid)
                const CarritoUsuario = cartid.Products
                res.render('cartId', { products: CarritoUsuario, cart: cid })
            } catch (error) { console.log(error) }
        }

    Chat =
        async (req, res) => {
            const Mensajes = await Chat.GetAll();
            res.render('Chat', ({ Mensajes }))
        }

    login =
        async (req, res) => {
            res.render('login')
        }

    logout =
        async (req, res) => {
            res.clearCookie("jwt");
            res.redirect('/views/login')
        }

    error =
        async (req, res) => {
            res.render('error')
        }

    signup =
        async (req, res) => {
            res.render('registro')
        }

    admin =
        async (req, res) => {
            let Productos = await ProductsService.GetAll(req.query)
            const userRole = req.user.role;
            if (userRole === 'admin') {
                res.render('admin', ({
                    Productos,
                    first_name: req.user.first_name,
                    email: req.user.email,
                    role: req.user.role,
                }))
            } else { res.status(403).send('No tienes permiso para acceder a esta página') }
        }
}

export const ViewsController = new ViewController()
