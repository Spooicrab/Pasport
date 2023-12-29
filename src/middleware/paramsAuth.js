import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const validateParams = (req, res, next) => {
    const token = req.params.tid;

    if (!token) {
        return res.status(403).json({ error: "Se requiere un token" });
    }

    jwt.verify(token, config.jwtsecret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: "Hubo un problema al autenticar el token." });
        }
        req.userId = decoded.id;
        next();
    });
};
