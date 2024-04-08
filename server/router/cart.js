var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/cart', async(req, res) => {
    const userid = req.query.id;
   try{
    const result = await db.query(`select cart.product_id, cart.user_id, cart.quantity from cart inner join product on cart.product_id=product.product_id where product.is_deleted='f' and cart.user_id=${userid}`);
    res.json(result.rows);
   }
   catch(err) {
    res.json({'err': err})
   }
})

router.post('/add_cart', async(req, res) => {
    const productID = req.body.productID;
    const userID = req.body.userID;
    const quantity = req.body.quantity;
    try{
        const result = await db.query(`select * from cart where product_id=${productID} and user_id=${userID}`);
        if(result.rows.length > 0) {
            res.json({'in_cart': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    try{
        const result = await db.query(`insert into cart (product_id, user_id, quantity) values (${productID}, ${userID}, ${quantity})`);
        res.json({})
        return;
    }
    catch(err) {
        res.json({'err':err});
    }
})

router.post('/edit_cart_quantity', async(req, res) => {
    const quantity = req.body.quantity;
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        const result = await db.query(`update cart set quantity=${quantity} where user_id=${userID} and product_id=${productID}`)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

router.post('/delete_cart', async(req, res) => {
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        const result = await db.query(`delete from cart where user_id=${userID} and product_id=${productID}`)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

module.exports = router;