var express = require('express');
var router = express.Router();
const db = require('../db')


router.get('/profile', async(req, res) =>{
    userid = req.query.userid;
    var result;
    try{
        result = await db.query(`select * from users where user_id = ${userid}`)
        res.json(result.rows)
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

router.post('/edit_profile', async(req, res) => {
    userid = req.body.userid;
    username = req.body.username;
    password = req.body.password;
    contact = req.body.contact.replace('\'', '\'\'')
    var result;
    try{
        result = await db.query(`update users set (username, password, contact) = ('${username}', '${password}', '${contact}') where user_id = ${userid}`)
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err})
        return;
    }
})

module.exports = router;