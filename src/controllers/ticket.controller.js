import { CartService } from "../services/Cart.services.js"
import { ticketService } from "../services/ticket.services.js"

class ticketControllers {

    getAll = async (req, res) => {
        try {
            const Tickets = await ticketService.GetAll()
            return res.status(200).json(Tickets)
        } catch (error) { return res.status(400).json(error) }
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
            console.log('Ticket::::::', Ticket);
            CartService.Vaciar(cid)
            res.render('ticket', Ticket)
        } catch (error) { console.log(error) }
    }


}

export const ticketController = new ticketControllers();
