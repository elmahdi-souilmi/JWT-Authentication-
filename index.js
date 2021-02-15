const mongoose = require('mongoose');
const express = require('express')
const app = express()
app.use(express.json())
const jwt = require('jsonwebtoken')
//models
const userModel = require('./model/user.model')
const bookModel = require('./model/books.model');
//const {json} = require('express');
// Connecting to the database
mongoose.connect('mongodb://localhost:27017/jwtest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("mongodb connected.."));

// verifytoken 
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}
// routes
//login
app.post('/login', async (req, res) => {
    let user = await userModel.findOne({
        name: req.body.name,
        password: req.body.password
    })
    console.log(user)

    if (user != null) {
        let token = jwt.sign({
            name: user.name,
            phone: user.password
        }, "testSecret", {
            expiresIn: '20s'
        })
        res.json({
            "token": token
        })
    } else {
        res.json({
            "message": "user not found"
        })
    }
})

app.post('/addUser', (req, res) => {
    let user = {
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password
    };
    userModel.create(user).then(res.json({
        "message": "user added"
    }))
})
//show book
app.get('/books', verifyToken, (req, res) => {
    jwt.verify(req.token, 'testSecret', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            bookModel.find()
                .then((Book) => res.json(Book))
                .catch((err) => res.status(400).json("Error :" + err));

        }

    })
})
app.listen(3000);