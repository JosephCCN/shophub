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
    contact = req.body.contact;
    if(contact) contact = contact.replace('\'', '\'\'')
    var result;
    console.log(userid, username, password, contact)
    try{
        result = await db.query(`select * from users where user_id!=${userid} and username='${username}'`);
        if(result.rows.length != 0){
            res.json({'username_exist': 1});
            return;
        }
        if(!password) {
            result = await db.query(`select password from users where user_id=${userid}`);
            console.log(result.rows)
            password = result.rows[0]['password']
        }
        if(!contact) {
            result = await db.query(`select contact from users where user_id=${userid}`);
            contact = result.rows[0]['contact'].replace('\'', '\'\'')
        }
        result = await db.query(`update users set (username, password, contact) = ('${username}', '${password}', '${contact}') where user_id = ${userid}`)
        res.json({'success': 1});
    }
    catch(err){
        res.json({'err': err})
        return;
    }
})

module.exports = router;