import { ErrorMessages } from "../error/dictionaryError.js"
import CustomError from "../error/error.js"
import { transporter } from "../nodemailer.js"
import { CartService } from "../services/Cart.services.js"
import { ticketService } from "../services/ticket.services.js"
import { consolelogger } from "../winston.js"

class ticketControllers {

    getAll = async (req, res) => {
        try {
            const Tickets = await ticketService.GetAll()
            return res.status(200).json(Tickets)
        } catch (error) {

            return res.status(400).json(error)
        }
    }

    getByID = async (req, res) => {
        const { tid } = req.params
        try {
            const Ticket = await ticketService.findById(tid)
            return res.status(200).json(Ticket)
        } catch (error) { return res.status(400).json(error) }
    }

    checkout = async (req, res) => {

        const { cid } = req.params
        const purchaser = req.user.email


        let Cart = await CartService.findByID(cid);
        Cart = Cart.toObject();
        Cart.purchaser = purchaser;

        try {
            const Ticket = await ticketService.CreateTicket(Cart)
            // consolelogger.debug(Ticket)
            CartService.Vaciar(cid)
            res.render('ticket', Ticket)

            const opt = {
                from: config.gmail_user.toString(),
                to: purchaser,
                subject: 'COMPRA',
                html: `
                <h1>BUYCODE: ${Ticket.CompraRealizada.code}</h1>
                <h2> Gracias, ${req.user.first_name}, su envio ya esta en camino!
                `
            }

            await transporter.sendMail(opt)
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.TICKET_NOT_CREATED)
        }
    }
}

export const ticketController = new ticketControllers();
