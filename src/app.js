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
import UserPremiumRouter from "./routes/userPremium.router.js";
import mockingRouter from "./routes/mocking.router.js";
import UserRouter from "./routes/users.router.js";
import { swaggerSetup } from "./swaggerSpecs.js";
import swaggerUi from "swagger-ui-express";
import sessionRouter from "./routes/sessions.router.js";
import ChatRouter from "./routes/Chat.router.js";
import restoreRouter from "./routes/restore.router.js";
import { errorMiddleware } from "./middleware/error.js";
import { consolelogger } from "./winston.js";


const JWTSECRET = config.jwtsecret
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const URI = config.mongo_uri
app.use(session({
    secret: 'key',
    cookie: { maxAge: 3600000 },
    store: new mongoStore({ mongoUrl: URI })
}))

app.use(passport.initialize());
app.use(passport.session())

app.engine('handlebars', handlebars.engine({

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
app.use('/api/users/premium', UserPremiumRouter)
app.use('/api/session', sessionRouter)
app.use('/restore', restoreRouter)
app.use('/api/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSetup))
app.use('/api/chat', ChatRouter)
app.use('/mockingproducts', mockingRouter)
app.get('/', (req, res) => {

    res.redirect('views/login')
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

    socket.on('chat message', async function (data) {
        socket.emit('Saved', { msg: data })
    });
});


