import { ProductManager } from "../dao/mongo/ProductManager.js";
import { ticketManager } from "../dao/mongo/ticketManager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";
import { consolelogger } from "../winston.js";

class ticketServices {

    async GetAll() {
        try {
            const response = await ticketManager.find();
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.TICKETS_NOT_FOUND)
        }
    }
    // 
    async findById(ID) {
        try {
            const response = await ticketManager.findByID(ID);
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.TICKET_NOT_FOUND)
        }
    }
    // 
    async Delete(ID) {
        try {
            const response = await ticketManager.findByIdAndDelete(ID)
            return response;
        } catch (error) {
            consolelogger.error(error)

            CustomError.createError(ErrorMessages.TICKET_NOT_DELETED)
        }
    }
    // 
    async CreateTicket(obj) {
        try {
            const code = await ticketService.GenerateCode()

            let compraRealizada = { "Productos": [], "PrecioTotal": 0, "purchaser": obj.purchaser, "code": code };

            let pendientes = { "Productos": [] };

            for (let i = 0; i < obj.Products.length; i++) {
                let pDetail = await ProductManager.GetById(obj.Products[i].product._id);
                if (obj.Products[i].Cantidad > pDetail.stock) {
                    pendientes.Productos.push(
                        {
                            "product": obj.Products[i].product,
                            "Cantidad": obj.Products[i].Cantidad - pDetail.stock
                        }
                    );
                    obj.Products[i].Cantidad = pDetail.stock;
                }
                compraRealizada.Productos.push(obj.Products[i]);
                compraRealizada.PrecioTotal += pDetail.price * obj.Products[i].Cantidad;
                pDetail.stock -= obj.Products[i].Cantidad;
                await ProductManager.Update(pDetail);
            }
            const IDCOMPRA = await ticketManager.Add(compraRealizada, code)
            return {
                "CompraRealizada": compraRealizada,
                "Pendientes": pendientes,
                "ID": IDCOMPRA,
            };
        } catch (error) {
            consolelogger.error(error)

            CustomError.createError(ErrorMessages.TICKET_NOT_CREATED)
        }
    }

    async GenerateCode() {
        try {
            const Tickets = await ticketManager.GetAll()
            let code = Tickets.length ? Tickets[Tickets.length - 1].code + 1 : 1500;
            return code
        } catch (error) {
            consolelogger.error(error)

            CustomError.createError(ErrorMessages.TICKETCODE_NOT_GENERATED)
        }
    }


}
export const ticketService = new ticketServices();
