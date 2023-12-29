import { Server } from "socket.io";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import passport from "passport";
import jwt from 'jsonwebtoken'

import config from "./config/config.js";
import "./dao/config.js"
import './passport.js'

import { __dirname } from "./utils.js";

//Views
import ViewsRouter from './routes/views.router.js'
import ProductRouter from "./routes/Product.router.js";
import CartRouter from "./routes/Cart.router.js";
import mockingRouter from "./routes/mocking.router.js";
import UserRouter from "./routes/users.router.js";
import sessionRouter from "./routes/sessions.router.js";
import ChatRouter from "./routes/Chat.router.js";
import restoreRouter from "./routes/restore.router.js";

// Services
import { CartService } from "./services/Cart.services.js";
import { ChatService } from "./services/Chat.services.js";
import { errorMiddleware } from "./middleware/error.js";
import { consolelogger } from "./winston.js";

// const URI = "mongodb+srv://Coder:House@midatabasecoder.ehu4trq.mongodb.net/EcommerceCoder?retryWrites=true&w=majority"

const JWTSECRET = config.jwtsecret
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

// 
app.use('/api/products', ProductRouter)
app.use('/views', ViewsRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UserRouter)
app.use('/api/session', sessionRouter)
app.use('/restore', restoreRouter)
app.use('/api/chat', ChatRouter)
app.use('/mockingproducts', mockingRouter)
app.get('/', (req, res) => {

    res.send(`<h1>Probando Winston</h1>`)
    consolelogger.debug('DEBUG')
    consolelogger.http('HTTP')
    consolelogger.info('INFO')
    consolelogger.warning('WARNING')
    consolelogger.error('ERROR')
    consolelogger.fatal('ERROR FATAL!')
})

// 
app.use(errorMiddleware)

const Port = config.port

const servidor = app.listen(Port, () => {
    try {
        consolelogger.info('Puerto conectado')
    } catch (error) {
        console.log(error);
    }
})

const Sserver = new Server(servidor)

Sserver.on("connection", (socket) => {
    consolelogger.debug(`Cliente conectado: ${socket.id}`);

    socket.on('Agregar', async (data) => {
        const producto = data.productId;
        const IdCarritoActual = data.IdCarritoActual;
        const token = data.token;

        //verifico aqui porque nose como hacerlo desde el enrutador usando socket.io
        jwt.verify(token, JWTSECRET, async (err, decodedToken) => {
            if (err) {
                socket.emit('error', 'Token no válido');
            } else if (decodedToken.role !== 'user') {
                socket.emit('error', 'No tienes permiso para agregar productos al carrito');
            } else {
                try {
                    await CartService.AgregarCantidad(IdCarritoActual, producto);
                    socket.emit('Agregado');
                } catch (error) { throw error; }
            }
        });
    });


    socket.on('chat message', async function (data) {
        const token = data.token
        jwt.verify(token, JWTSECRET, async (err, decodedToken) => {
            if (err) {
                socket.emit('error', 'Token no válido');
            } else if (decodedToken.role !== 'user') {
                socket.emit('error', 'No tienes permiso para agregar productos al carrito');
            } else {
                delete data.token
                await ChatService.Add(data);
                socket.emit('Saved', { msg: data })
            }
        });
    });

});

