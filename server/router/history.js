var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/orderid', async(req, res) => {
    userid = req.query.userid;
    amount = req.query.top;
    var result;
    try{
        result = await db.query(`select distinct on (order_id) order_id from history where buyer_id=${userid} order by order_id, order_date desc limit ${amount}`);
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

router.get('/order', async(req, res) => {
    orderid = req.query.orderid;
    var result;
    try{
        result = await db.query(`select * from history where order_id=${orderid}`)
        res.json(result.rows);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
})

router.get('/order_product', async(req, res) => {
    productid = req.query.productid;
    try{
        result = await db.query(`select * from history where product_id=${productid}`)
        res.json(result.rows);
    }
    catch(err){
        res.json({'err': err});
    }
})

router.get('/bought', async(req, res) => {
    const userID = req.query.buyer_id;
    const productID = req.query.product_id;
    var result;
    try{
        result = await db.query(`select * from history where buyer_id=${userID} and product_id=${productID}`);
    }
    catch(err) {
        res.json({'err': err});
        return;
    }
    if(result.rows.length == 0) res.json({'bought': false});
    else res.json({'bought': true});
})

module.exports = router;