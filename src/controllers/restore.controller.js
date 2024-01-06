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
            // tls: {
            //     rejectUnauthorized: false
            // },
            subject: 'Recuperar cuenta',
            html: `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #666;
                }
                form {
                    margin-top: 20px;
                }
                button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    text-decoration: none;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
            <body>
                <h1>Recuperar Contraseña</h1>
                <p>Por favor, haz clic en el siguiente botón para cambiar tu contraseña:</p>
                <a href='http://localhost:8080/restore/restorepass/${token}'>Cambiar Contraseña</a>
            </body>
            `
        }
        await transporter.sendMail(opt)
        res.send(`Token enviado via mail`)
        consolelogger.debug(token)
    }
}

export const restoreController = new restoreControllers()