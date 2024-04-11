var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/review', async(req, res) => {
    productid = req.query.productid;
    userid = req.query.userid;
    try{
        result = await db.query(`select * from review where (product_id, user_id) = (${productid}, ${userid})`)
        if(result.rows.length === 0) res.json({0:{'exist': 0}})
        else{
            result.rows[0]['exist'] = 1
            res.json(result.rows)
        }
    }
    catch(err){
        res.json({'err': err});
        return;
    }
})

router.get('/product_review', async(req, res) => {
    const productID = req.query.product_id;
    try {
        const result = await db.query(`select * from review where product_id=${productID}`)
        res.json(result.rows)
    }
    catch(err) {
        res.json({'err':err})
    }
})

router.post('/review', async(req, res) => {
    const productID = req.body.product_id;
    const userID = req.body.user_id;
    var context = req.body.context;
    const rating = req.body.rating
    // console.log(productID, userID, context, rating);
    try {
        const result = await db.query(`select * from review where product_id=${productID} and user_id=${userID}`);
        if(result.rows.length == 0) await db.query(`insert into review (product_id, user_id, context, rating) values (${productID}, ${userID}, '${context}', ${rating})`)
        else await db.query(`update review set (context, rating) = ('${context}', ${rating}) where product_id=${productID} and user_id=${userID}`);
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
    res.json({'success': 1});
})

module.exports = router;