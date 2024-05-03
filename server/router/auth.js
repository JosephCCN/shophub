var express = require('express');
var router = express.Router();
const db = require('../db')


//handle login request, respond userID if login success / respond fail msg if login fail
router.post('/login', async(req, res) => { 
    username = req.body.username;
    pwd = req.body.password;
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
    result = await db.query(`select user_id, is_admin from users where username='${username}'`)
    res.json(result.rows[0])
})


//handle register request, insert user into db if username is not inside db, otherwise respond fail msg
router.post('/register', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
    //check if username already be used
    var result = await db.query(`select password from users where username='${username}'`);
    if(result.rows.length > 0) {
        res.json({err: 'username exist'});
        return;
    }
    //insert into db
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

module.exports = router;