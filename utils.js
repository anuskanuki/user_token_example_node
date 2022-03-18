var jwt = require('jsonwebtoken');
const secret = "meu-segredo"; //esse segredo do JWT seria uma config

module.exports = {
    verifyJWT(req, res, next) {
        var token = req.headers['x-access-token'];
        if (!token)
            return res.status(401).send({
                auth: false,
                message: 'Token não informado.'
            });

        jwt.verify(token, secret, function (err, decoded) {
            if (err)
                return res.status(500).send({
                    auth: false,
                    message: 'Token inválido.'
                });

            req.userId = decoded.id;
            console.log("User Id: " + decoded.id)
            next();
        });
    }
}