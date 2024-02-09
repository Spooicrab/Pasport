import { ProductsService } from "../services/Product.services.js"
import { CartService } from "../services/Cart.services.js"
import { ChatService } from "../services/Chat.services.js"
import { UserService } from "../services/User.services.js"

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
                    cart: req.user.cart._id,
                    id: req.user.id,
                    token: req.cookies['jwt']
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

    Multer =
        async (req, res) => {
            const { idUser } = req.params
            const user = await UserService.findById(idUser)
            res.render('DocsUpload', { Id: idUser, Rol: user.role, Docs: user.documents });
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
            const userRole = req.user.role;
            let Productos = await ProductsService.GetAll(req.query)
            const users = await UserService.findAll()
            if (userRole === 'admin') {
                res.render('admin', ({
                    Productos,
                    users,
                    first_name: req.user.first_name,
                    email: req.user.email,
                    token: req.cookies['jwt'],
                    role: req.user.role,
                }))
            } else { res.status(403).send('No tienes permiso para acceder a esta página') }
        }

    premium =
        async (req, res) => {
            let Productos = await ProductsService.GetAll(req.query)
            const userRole = req.user.role;
            if (userRole === 'premium') {
                res.render('premium', ({
                    Productos,
                    first_name: req.user.first_name,
                    email: req.user.email,
                    role: req.user.role,
                    Id: req.user.id
                }))
            } else { res.status(403).send('No tienes permiso para acceder a esta página') }
        }

    UpdateDocs =
        async (req, res) => {
            res.render('upload')
        }

}

export const ViewsController = new ViewController()
