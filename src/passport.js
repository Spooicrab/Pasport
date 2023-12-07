import passport from "passport";
import config from "./config/config.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { HashData, CompareData, generateToken } from "./utils.js";
import { CartService } from "./services/Cart.services.js";
import { UserService } from "./services/User.services.js";

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
            // userDB.isAdmin =
            // email === "adminCoder@coder.com" && password === "Cod3r123" ? "admin" : "User"
            const HashedPass = await HashData(password)
            const CarritoUsuario = await CartService.CrearCarrito()
            const createdUser = await UserService.createOne({
                ...req.body,
                cart: CarritoUsuario,
                password: HashedPass
            });

            done(null, createdUser)
        }
    )
)

passport.use('login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            const userDB = await UserService.findByEmail(email)
            // console.log('userDB:', userDB)
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
                done(null, userDB)

            } catch (error) { done(error) }
        }
    )
)

//JWT cookie

const fromCookies = (req) => {
    // console.log('estoy extrayendo cookies');
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
            console.log("---jwt-passport---", jwt_payload);
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
                    cart: CarritoUsuario,
                    Github: true
                }
                const createdUser = await UserService.createOne(newUser);

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