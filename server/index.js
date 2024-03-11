const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()
var bodyParser = require('body-parser')
const port = 3030

app.use(cors())
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Deployed');
})

app.get('/cart', (req, res) => {
    var userid = req.query.userid
    const result = db.query('select * from users')
    res.json(result.rows)
})

app.post('/login', (req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    console.log(username, pwd);
    res.json({userid: 3});
})

app.listen(port, (err) => {
    console.log('running...')
})