import passport from "passport";
import { usersManager } from './dao/mongo/UserManager.js'
import { Strategy as LocalStrategy } from "passport-local";
import { HashData, CompareData } from "./utils.js";

passport.use('signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            const userDB = await usersManager.findByEmail(email)
            if (userDB) { return done(null, false) }
            // userDB.isAdmin =
            // email === "adminCoder@coder.com" && password === "Cod3r123" ? "admin" : "User"
            const HashedPass = await HashData(password)
            const createdUser = await usersManager.createOne({
                ...req.body,
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
            try {
                const userDB = await usersManager.findByEmail(email)
                if (!userDB) { return done(null, false) }
                const isValid = await CompareData(password, userDB.password)
                if (!isValid) { return done(null, false) }
                else { done(null, userDB) }
            } catch (error) { done(error) }
        }
    )
)

passport.serializeUser(function (user, done) {
    done(null, user._id)
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await usersManager.findById(id)
        done(null, user)
    } catch (error) { done(error) }
})