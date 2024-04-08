var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/user', async(req, res) => {
    userid = req.query.userid;
    try{
        result = await db.query(`select * from users where user_id=${userid}`)
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

router.get('/all_users', async(req, res) => {
    try {
        result = await db.query(`select * from users`);
    }
    catch(err) {
        res.json({'err':err});
    }
})

router.get('/username', async(req, res) => {
    id = req.query.id;
    try{
        result = await db.query(`select username from users where user_id=${id}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

module.exports = router;