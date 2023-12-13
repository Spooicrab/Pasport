import { ticketModel } from "../../models/ticket.models.js";

class ticketManagers {

    async GetAll() {
        const response = await ticketModel.find();
        return response;
    }
    // 
    async GetByID(ID) {
        const response = await ticketModel.findById(ID);
        return response;
    }
    // 
    async Add(obj) {
        const response = await ticketModel.create(obj)
        return response._id;
    }
    // 
    async Delete(ID) {
        const response = await ticketModel.findByIdAndDelete(ID)
        return response;
    }

}
export const ticketManager = new ticketManagers();
