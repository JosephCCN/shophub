
var express = require('express');
var router = express.Router();
const db = require('../db')

add_noti = async(msg, productid) => {
    const fetch_user = await db.query(`select user_id from wishlist where product_id = ${productid}`)
    const userlist = fetch_user.rows
    const L = Object.keys(userlist).length
    for(var i=0;i<L;i++){
        const cur_user_id = userlist[i]['user_id'];
        const fetch_num_of_noti = await db.query(`select count(*) from noti where user_id = ${cur_user_id}`);
        const number_of_noti = fetch_num_of_noti.rows[0]['count']
        if(number_of_noti == 10){
            await db.query(`delete from noti where create_at = (select create_at from noti order by create_at asc limit 1) `);
        }
        await db.query(`insert into noti (user_id, context, product_id) values (${cur_user_id}, '${msg}', ${productid})`)
    }
}

router.get('/user_notification', async(req, res) => {
    userid = req.query.userid;
    try{
        result = await db.query(`select product_id, context, current_timestamp - noti.create_at as time from noti where user_id = ${userid}`)
        res.json(result.rows)
    }
    catch(err){
        res.json({'err': err})
    }

})

module.exports = router;