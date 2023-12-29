import config from "../config/config.js"
import { transporter } from "../nodemailer.js"
import { UserService } from "../services/User.services.js"
import { generateToken } from "../utils.js"
import { consolelogger } from "../winston.js"



class restoreControllers {

    restore = async (req, res) => {

        const id = req.userId
        try {
            res.render('restore', { id: id })
        } catch (error) { console.log(error) }
    }

    ChangePass = async (req, res) => {
        const { tid } = req.params
        const newpass = req.body.password
        const passVerify = req.body.password2
        try {
            if (newpass == passVerify) {
                const Change = await UserService.ChangePass(tid, newpass)
                Change == 1 ?
                    res.send('No puede usar la misma contraseña anterior')
                    :
                    res.send('Contraseña reestablecida')
            }
            if (newpass !== passVerify) {
                res.send('las contraseñas no coinciden, intentelo nuevamente')
            }

        } catch (error) {

        }
    }

    jwtcode = async (req, res) => {
        let accountMail = req.body
        let account = await UserService.findByEmail(accountMail.email)

        const toToken = {
            id: account.id,
            email: account.email,
        }

        const token = generateToken(toToken)

        const opt = {
            from: config.gmail_user.toString(),
            to: account.email.toString(),
            subject: 'Recuperar cuenta',
            html: `
            <h1>Recuperar Contraseña</h1>
            <p>Por favor, ingrese con el siguiente token para cambiar su contraseña via params:
            ${token}
            </p>
            `
        }
        await transporter.sendMail(opt)
        res.send(`Token enviado: ${token}`)
    }
}

export const restoreController = new restoreControllers()