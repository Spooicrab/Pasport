import { UserService } from "../services/User.services.js"

class SessionController {

    GithubAuth =
        (req, res) => {
            res.cookie('jwt', req.user.token, { httpOnly: false });
            res.redirect('/views/products');
        }

    FindSession =
        async (req, res) => {
            const { idUser } = req.params
            try {
                const user = await UserService.findById(idUser)
                res.status(200).json({ message: 'user found', user })
            } catch (error) { return res.status(500).json(error) }
        }

}

export const SessionControllers = new SessionController()