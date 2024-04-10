var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/seller_product', async(req, res) => {
    id = req.query.id;
    asc = req.query.asc;
    if(asc == 1) query_msg = `select * from product where (seller_id, is_deleted)=(${id}, false) order by product_id asc`
    else query_msg = `select * from product where (seller_id, is_deleted)=(${id}, false) order by product_id desc`
    try{
        result = await db.query(query_msg);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
}
)

router.get('/seller_history', async(req, res) => {
    userid = req.query.userid;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select history.* from history join product on history.product_id = product.product_id where (history.seller_id, product.is_deleted) = (${userid}, false) order by history.order_date desc limit ${amount}`);
        const result2 = await db.query(`select history.order_date at time zone ('Asia/Hong_Kong') from history join product on history.product_id = product.product_id where (history.seller_id, product.is_deleted) = (${userid}, false) order by history.order_date desc limit ${amount}`);
        console.log(result2);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

module.exports = router;