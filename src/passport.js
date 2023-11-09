import passport from "passport";
import { usersManager } from './dao/mongo/UserManager.js'
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { HashData, CompareData } from "./utils.js";

//Local
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

//GitHub
passport.use(
    'github',
    new GithubStrategy(
        {
            clientID: 'Iv1.ebb107bc973233d1',
            clientSecret: '8043e4066cd5ef4836a74ca5035c1357f09862cf',
            callbackURL: 'http://localhost:8080/views/productsPassport'
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                const userDB = await usersManager.findByEmail(profile.email)
                if (userDB) {
                    if (userDB.Github) {
                        return done(null, userDB)
                    } else {
                        return done(null, false)
                    }
                }

                //signup

                const newUser = {
                    first_name: 'test',
                    last_name: 'test2',
                    email: profile.email,
                    password: 123,
                    Github: true
                }
                const createdUser = await usersManager.createOne(newUser);
                done(null, createdUser);

            } catch (error) { done(error) }
        }

    ))


passport.serializeUser(function (user, done) {
    done(null, user._id)
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await usersManager.findById(id)
        done(null, user)
    } catch (error) { done(error) }
})