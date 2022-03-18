var http = require('http'); 
const express = require('express') 
const app = express() 

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

const users = require('./mocks/usuarios')
const secret = "ac81221d-d874-4160-b4c5-e5e868d16f2b";
 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 
 
//rota protegida
app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.status(200).json([{id:1,nome:'luiz'}]);
}) 

//rota de login
app.post('/login', (req, res, next) => { 

    const validUser = users.users.find(userFound => userFound.userName === req.body.user && userFound.psw === req.body.pwd);

    if(validUser) {
        var token = jwt.sign({ validUser }, secret, { 
            expiresIn: 300, // 5min
        }); 
        return res.status(200).send({ auth: true, token: token }); 
    }
    
    return res.status(401).send('Login inválido!'); 
})    

//rota de logout
app.post('/logout', function(req, res) { 
    console.log("Fez logout e cancelou o token!");
    res.status(200).send({ auth: false, token: null }); 
});

//função que verifica se o JWT é ok
function verifyJWT(req, res, next){ 
    var token = req.headers['x-access-token']; 
    if (!token) 
        return res.status(401).send({ auth: false, message: 'Token não informado.' }); 
    
    jwt.verify(token, secret, function(err, decoded) { 
        if (err) 
            return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
        
        req.userId = decoded.id; 
        console.log("User Id: " + decoded.id)
        next(); 
    }); 
}    

var server = http.createServer(app); 
server.listen(3401);
console.log("Servidor escutando na porta 3401...")