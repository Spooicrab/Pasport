import { Router } from "express";
import passport from "passport";
const UserRouter = Router();

// Sin passport:
// UserRouter.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const userDB = await usersManager.findByEmail(email);

//     if (!userDB) { return res.json({ error: "Verifique los datos ingresados" }) }
//     // req.session["email"] = email;
//     // req.session["first_name"] = userDB.first_name;
//     // req.session['last_name'] = userDB.last_name
//     // req.session['isAdmin'] =
//     //     email === "adminCoder@coder.com" && password === "Cod3r123" ? "admin" : "User"
//     // res.redirect("/views/products");

//     const isValid = await CompareData(password, userDB.password)
//     if (!isValid) {
//         return res.status(401).json({ message: 'Verifique los datos ingresados' })
//     } else {
//         res.redirect('/views/products')
//     }
// });

// UserRouter.post("/signup", async (req, res) => {
//     const { password } = req.body
//     try {
//         const HashedPass = await HashData(password)
//         const createdUser = await usersManager.createOne({
//             ...req.body,
//             password: HashedPass
//         });
//         res.status(200).json({ message: "User created", createdUser });
//     } catch (error) { return res.status(400).json(error) }

// });

UserRouter.post('/signup', passport.authenticate('signup'), (req, res) => {
    res.redirect('/views/login')

})

UserRouter.post('/login', passport.authenticate('login'), (req, res) => {
    res.redirect('/views/products')
})

export default UserRouter;