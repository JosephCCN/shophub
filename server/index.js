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

app.post('/login', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    console.log(username, pwd);
    var result = await db.query(`select password from users where username='${username}'`)
    if(result.rows.length != 1) {
        res.json({err: 'No Such User'});
        return;
    }
    real_password = result.rows[0]['password'];
    if(pwd != real_password) {
        res.json({err: 'Wrong Password'});
        return;
    }
    result = await db.query(`select user_id from users where username='${username}'`)
    res.json(result.rows[0])
})

app.post('/register', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    console.log(username, pwd);
    var result = await db.query(`select password from users where username='${username}'`);
    if(result.rows.length > 0) {
        res.json({err: 'username exist'});
        return;
    }
    result = await db.query(`insert into users (username, password) values ('${username}', '${pwd}')`);
    if(result.rows[0] == 'INSERT 0 1') {
        res.json({});
        return;
    }
    else {
        res.json({err: result.rows[0]});
        return;
    }
})

app.listen(port, (err) => {
    console.log('running...')
})