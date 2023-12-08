import { Server } from "socket.io";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import passport from "passport";

import config from "./config/config.js";
import "./dao/config.js"
import './passport.js'

import { __dirname } from "./utils.js";
import { CartService } from "./services/Cart.services.js";


//Views
import ViewsRouter from './routes/views.router.js'
import ProductRouter from "./routes/Product.router.js";
import CartRouter from "./routes/Cart.router.js";
import UserRouter from "./routes/users.router.js";
import sessionRouter from "./routes/sessions.router.js";
import ChatRouter from "./routes/Chat.router.js";
import { ChatService } from "./services/Chat.services.js";
import { ChatController } from "./controllers/Chat.controller.js";

// const URI = "mongodb+srv://Coder:House@midatabasecoder.ehu4trq.mongodb.net/EcommerceCoder?retryWrites=true&w=majority"

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const URI = config.mongo_uri
app.use(session({
    secret: 'key',
    cookie: { maxAge: 600000 },
    store: new mongoStore({ mongoUrl: URI })
}))

app.use(passport.initialize());
app.use(passport.session())

app.engine('handlebars', handlebars.engine({

    /* 
    Añado esta runtimeOptions porque recibia este error al querer renderizar el carrito del usuario:

    Handlebars: Access has been denied to resolve the property "product" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
Handlebars: Access has been denied to resolve the property "Cantidad" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details
  
*/
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }

}))

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/products', ProductRouter)
app.use('/views', ViewsRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UserRouter)
app.use('/api/session', sessionRouter)
app.use('/api/chat', ChatRouter)


const Port = config.port

const servidor = app.listen(Port, () => {
    console.log("Puerto conectado")
})

const Sserver = new Server(servidor)

Sserver.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('CrearCarrito', async (data) => {
        const productId = data
        const IdCarritoCreado = await CartService.CrearCarrito();
        socket.emit('creado', { productId, IdCarritoCreado });
    });

    socket.on('Agregar', async (data) => {
        const producto = data.productId;
        const IdCarritoActual = data.IdCarritoActual;
        try {
            const agregar = await CartService.AgregarCantidad(IdCarritoActual, producto);
            socket.emit('Agregado');
        } catch (error) { throw error; }
    });

    socket.on('chat message', async function (msg) {
        await ChatService.Add(msg);
        console.log('se guarda el mensaje en la db');
        socket.emit('Saved', { msg })
    });

});

