
class SessionController {

    GithubAuth =
        (req, res) => {
            req.session.user = req.user
            console.log(req.user)
            res.redirect('/views/products')
        }

    FindSession =
        async (req, res) => {
            const { idUser } = req.params
            try {
                const user = await usersManager.findById(idUser)
                res.status(200).json({ message: 'user found', user })
            } catch (error) { return res.status(500).json(error) }
        }

    DestroySession =
        (req, res) => {
            req.session.destroy(() => {
                res.redirect("views/login");
            });
        }
}

export const SessionControllers = new SessionController()