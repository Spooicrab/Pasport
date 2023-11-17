import { Server } from "socket.io";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import passport from "passport";

import "./dao/config.js"
import './passport.js'

import { __dirname } from "./utils.js";
import { CartM } from "./dao/mongo/CartManager.js";


//Views
import ViewsRouter from './routes/views.router.js'
import ProductRouter from "./routes/Product.router.js";
import CartRouter from "./routes/Cart.router.js";
import UserRouter from "./routes/users.router.js";
import sessionRouter from "./routes/sessions.router.js";

const URI = "mongodb+srv://Coder:House@midatabasecoder.ehu4trq.mongodb.net/EcommerceCoder?retryWrites=true&w=majority"

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: 'key',
    cookie: { maxAge: 600000 },
    store: new mongoStore({ mongoUrl: URI })
}))

app.use(passport.initialize());
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/products', ProductRouter)
app.use('/views', ViewsRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UserRouter)
app.use('/api/session', sessionRouter)

const Port8080 = app.listen(8080, () => {
    console.log("Puerto 8080")
})

const Sserver = new Server(Port8080)

Sserver.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('CrearCarrito', async (data) => {
        const productId = data
        const IdCarritoCreado = await CartM.CrearCarrito();
        socket.emit('creado', { productId, IdCarritoCreado });
    });

    socket.on('Agregar', async (data) => {
        const producto = data.productId;
        const IdCarritoActual = data.IdCarritoActual;
        try {
            const agregar = await CartM.AgregarCantidad(IdCarritoActual, producto);
            socket.emit('Agregado');
        } catch (error) { throw error; }
    });
});
