import passport from "passport";
import config from "./config/config.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { HashData, CompareData, generateToken } from "./utils.js";
import { CartService } from "./services/Cart.services.js";
import { UserService } from "./services/User.services.js";
import { consolelogger } from "./winston.js";

const JWTKEY = config.jwtsecret


// Local
passport.use('signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            const userDB = await UserService.findByEmail(email)
            if (userDB) { return done(null, false) }
            if (email == 'Coder@Admin.com' && password == 'admin') {
                const HashedPass = await HashData(password)
                const createdUser = await UserService.createOne({
                    ...req.body,
                    password: HashedPass,
                    role: 'admin'
                });
                done(null, createdUser)
            }
            const HashedPass = await HashData(password)
            const CarritoUsuario = await CartService.CrearCarrito()
            const createdUser = await UserService.createOne(
                {
                    ...req.body,
                    cart: CarritoUsuario,
                    password: HashedPass
                }
            );

            done(null, createdUser)
        }
    )
)

passport.use('CreatePremium',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            const userDB = await UserService.findByEmail(email)
            if (userDB) { return done(null, false) }
            const HashedPass = await HashData(password)
            const CarritoUsuario = await CartService.CrearCarrito()
            const createdUser = await UserService.createPremiumUser(
                {
                    ...req.body,
                    cart: CarritoUsuario,
                    password: HashedPass,
                    role: 'premium'
                }
            );

            done(null, createdUser)
        }
    )
)

passport.use('login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            const userDB = await UserService.findByEmail(email)
            try {
                if (!userDB) { return done(null, false) }
                const isValid = await CompareData(password, userDB.password)
                if (!isValid) { return done(null, false) }
                const token = generateToken(
                    {
                        id: userDB._id,
                        email,
                        first_name: userDB.first_name,
                        last_name: userDB.last_name,
                        age: userDB.age,
                        role: userDB.role,
                        cart: userDB.cart
                    }
                )
                userDB.token = token
                consolelogger.debug('---TOKEN:')
                consolelogger.debug(userDB.token)
                done(null, userDB)

            } catch (error) { done(error) }
        }
    )
)

//JWT cookie

const fromCookies = (req) => {
    return req.cookies.jwt;
};

passport.use(
    "jwt",
    new JWTStrategy(
        {
            secretOrKey: JWTKEY,
            jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        },
        async (jwt_payload, done) => {
            done(null, jwt_payload);
        }
    )
);

//GitHub
passport.use(
    'github',
    new GithubStrategy(
        {
            clientID: 'Iv1.ebb107bc973233d1',
            clientSecret: '8043e4066cd5ef4836a74ca5035c1357f09862cf',
            callbackURL: 'http://localhost:8080/api/session/github'
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                const userDB = await UserService.findByEmail(profile._json.email)
                if (userDB) {
                    if (userDB.Github) {
                        const token = generateToken(
                            {
                                id: userDB._id,
                                email: userDB.email,
                                first_name: userDB.first_name,
                                last_name: userDB.last_name,
                                age: userDB.age,
                                role: userDB.role,
                                cart: userDB.cart
                            }
                        )
                        userDB.token = token
                        return done(null, userDB)
                    } else {
                        return done(null, false)
                    }
                }

                //signup
                const CarritoUsuario = await CartService.CrearCarrito()

                const newUser = {
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1] || '',
                    email: profile._json.email,
                    password: 'test123',
                    role: 'user',
                    cart: CarritoUsuario,
                    Github: true
                }
                const createdUser = await UserService.createOne(newUser);
                const token = generateToken(
                    {
                        id: createdUser._id,
                        email: createdUser.email,
                        first_name: createdUser.first_name,
                        last_name: createdUser.last_name,
                        age: createdUser.age,
                        role: createdUser.role,
                        cart: createdUser.cart
                    }
                )
                createdUser.token = token

                done(null, createdUser);

            } catch (error) { done(error) }
        }

    ))


passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserService.findById(id)
        done(null, user)
    } catch (error) { done(error) }
})