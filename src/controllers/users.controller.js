import { UserService } from "../services/User.services.js";

class UserController {

    Register =
        (req, res) => {
            res.redirect('/views/login')
        }

    FindUser =
        async (req, res) => {
            const { idUser } = req.params
            try {
                const user = await UserService.findById(idUser)
                res.status(200).json({ message: 'user found', user })
            } catch (error) { return res.status(500).json(error) }
        }

    Login =
        (req, res) => {
            res.cookie('jwt', req.user.token, { httpOnly: true });
            res.redirect('/views/products');
        }
}
export const UsersController = new UserController()