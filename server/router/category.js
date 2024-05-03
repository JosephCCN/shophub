var express = require('express');
var router = express.Router();
const db = require('../db')

//return all the tag of category
router.get('/category_list', async(req, res) =>{
    try{
        result = await db.query(`select * from category_list`);
        res.json(result.rows);
    }
    catch(err){
        res.json({'err': err})
    }
})

//return the category of product with productID
router.get('/category', async(req, res) => {
    const productid = req.query.productid
    try{
        result = await db.query(`select * from category where product_id = ${productid}`)
        res.json(result.rows);
    }
    catch(err){
        res.json({'err': err})
    }
})

module.exports = router;
