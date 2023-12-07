import jwt from 'jsonwebtoken'

export const VerifyRole = (req, res, next) => {
    const token = req.cookies.jwt;

    // Verifica y decodifica el token
    jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
        if (err) {
            console.log(err);
        } else {
            // Accede al rol del usuario
            const userRole = decodedToken.role;
            if (userRole === 'admin') {
                // El usuario es un administrador
            } else if (userRole === 'user') {
                // El usuario es un usuario normal
            }
        }
    });
}
