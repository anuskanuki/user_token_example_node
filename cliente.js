
const express = require('express')
const router = express.Router();

const x = require('./utils'); 

router.get('/clientes', x.verifyJWT(), (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.status(200).json([{id:1,nome:'luiz'}]);
})
