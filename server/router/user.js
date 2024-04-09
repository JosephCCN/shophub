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
        res.json(result.rows)
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

router.get('/delete_user', async(req, res) => {
    const userid = req.query.userid;
    try{
        result = await db.query(`delete from users where user_id=${userid}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json({'success': 1});
})

router.get('/admin', async(req, res) => {
    const userid = req.query.userid;
    try{
        result = await db.query(`select is_admin from users where user_id=${userid}`);
        res.json(result.rows[0]['is_admin']);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

module.exports = router;