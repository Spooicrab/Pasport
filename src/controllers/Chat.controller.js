import { ChatService } from "../services/Chat.services.js";
import { consolelogger } from "../winston.js";

class ChatControllers {

    Chats =
        async (req, res) => {
            try {
                const Mensajes = await ChatService.GetAll();
                return res.status(200).json(Mensajes)
            } catch (error) { return res.status(400).json(error) }
        }

    Envio =
        async (req, res) => {
            const userRole = req.user.role;
            if (userRole === 'user' || userRole === 'premium') {
                try {
                    const { name, message } = req.body;
                    try {
                        await ChatService.Add(req.body);
                    } catch (error) { return res.status(400).json(error) }
                } catch (error) { console.log(error); }
            } else {
                res.send('solo para clientes')
            }
        }
}
export const ChatController = new ChatControllers()