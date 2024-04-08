var express = require('express');
var router = express.Router();
const db = require('../db')


router.post('/add_to_wishlist', async(req, res) => {
    const productid = req.body.productid;
    const userid = req.body.userid;
    try{
        const result = await db.query(`select * from wishlist where product_id=${productid} and user_id=${userid}`);
        if(result.rows.length > 0) {
            res.json({'in_wishlist': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    try{
        const result = await db.query(`insert into wishlist (product_id, user_id) values (${productid}, ${userid})`);
        res.json({})
        return;
    }
    catch(err) {
        res.json({'err':err});
    }
})

router.get('/wishlist', async(req, res) => {
    const userid = req.query.userid;
    try{
        const result = await db.query(`select wishlist.product_id from wishlist join product on product.product_id = wishlist.product_id where (wishlist.user_id, product.is_deleted) = (${userid}, false)`)
        res.json(result.rows)
        return;
    }
    catch(err) {
        res.json({'err':err})
    }
})

router.post('/remove_from_wishlist', async(req, res) => {
    const userid = req.body.userid;
    const productid = req.body.productid;
    try{
        const result = await db.query(`delete from wishlist where (user_id, product_id)=(${userid}, ${productid})`)
        res.json({})
    }
    catch(err){
        res.json({'err':err})
    }
})

module.exports = router;