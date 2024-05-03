var express = require('express');
var router = express.Router();
const db = require('../db')

//return all cart information for userID = userid
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

//handle add product to cart request
router.post('/add_cart', async(req, res) => {
    const productID = req.body.productID;
    const userID = req.body.userID;
    const quantity = req.body.quantity;
    try{
        //check if product already inside shopping cart
        var result = await db.query(`select * from cart where product_id=${productID} and user_id=${userID}`);
        if(result.rows.length > 0) {
            res.json({'in_cart': 1});
            return;
        }
        //check if the product is out of stock
        result = await db.query(`select quantity from product where product_id=${productID}`);
        if(result.rows[0]['quantity'] == 0) {
            res.json({'no_stock': 1});
            return;
        }
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    try{
        //add product into cart and save into db
        const result = await db.query(`insert into cart (product_id, user_id, quantity) values (${productID}, ${userID}, ${quantity})`);
        res.json({})
        return;
    }
    catch(err) {
        res.json({'err':err});
    }
})

//handle change the quantity of a product that inside shopping cart
router.post('/edit_cart_quantity', async(req, res) => {
    const quantity = req.body.quantity;
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        //update quantity of the product, no action if the product is not inside cart of user with userID
        const result = await db.query(`update cart set quantity=${quantity} where user_id=${userID} and product_id=${productID}`)
        console.log(1)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

//handle remove product from cart request
router.post('/delete_cart', async(req, res) => {
    const userID = req.body.userID;
    const productID = req.body.productID;
    try {
        //delete product with productID from cart if it belongs to user with userID
        const result = await db.query(`delete from cart where user_id=${userID} and product_id=${productID}`)
        res.json({'success': 1})
    }
    catch(err) {
        res.json({'err':err})
    }
})

//return the total price of all products inside cart of user with userID
router.get('/cart_totalprice', async(req, res) => {
    const userid = req.query.userid;
    try {
        var result = await db.query(`select sum(product.price*cart.quantity) from product inner join cart on cart.product_id=product.product_id where user_id=${userid}`)
        res.json(result.rows)
    }
    catch(err) {
        res.json({'err':err})
    }
})

module.exports = router;