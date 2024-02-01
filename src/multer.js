import multer from "multer";
import { __dirname } from "./utils.js";
import path from 'path';
import { UserService } from "./services/User.services.js";
import { consolelogger } from "./winston.js";

const storage = multer.diskStorage({
    destination: async function async(req, file, cb) {
        let folder;
        switch (file.fieldname) {
            case 'Id':
                folder = 'IDs';
                break;
            case 'Domicilio':
                folder = 'Domicilios';
                break;
            case 'accountStatus':
                folder = 'AccountStatuses';
                break;
            case 'profile':
                folder = 'profiles';
                break;
            case 'product':
                folder = 'products';
                break;
        }
        if (folder === 'product') {
            cb(null, path.join(__dirname, '/Multer', folder));
        }
        if (folder === 'IDs' || folder === 'Domicilios' || folder === 'AccountStatuses') {
            const { idUser } = req.params
            const uniqueSuffix = idUser + '-' + file.fieldname + '-' + Date.now();
            await UserService.updateDocs(idUser, file.fieldname, uniqueSuffix)
            cb(null, path.join(__dirname, '/Multer/documents', folder));
        }
        if (folder === 'profiles') {
            cb(null, path.join(__dirname, '/Multer', folder));
        }
    },
    filename: function (req, file, cb) {
        const { idUser } = req.params
        const uniqueSuffix = idUser + '-' + file.fieldname + '-' + Date.now();
        cb(null, uniqueSuffix)
    },
});

export const upload = multer({ storage: storage });
