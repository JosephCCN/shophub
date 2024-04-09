var express = require('express');
var router = express.Router();
const db = require('../db')

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

router.post('/register', async(req, res) => {
    username = req.body.username;
    pwd = req.body.password;
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

module.exports = router;