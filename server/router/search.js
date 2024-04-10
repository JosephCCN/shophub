var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/search', async(req, res) => {
    key = req.query.key;
    const l = key.length;
    var result;
    try{
        if(Number(key)) result = await db.query(`select * from product where product_id='${key}' and is_deleted=false`);
        else result = await db.query(`select * from product where LEFT(product_name, ${l})='${key}' and is_deleted=false`);
    }
    catch (err) {
        res.json({'err': err});
        return;
    }
    res.json(result.rows);
})

router.post('/adv_search', async(req, res) => {

    const unqiue = (list) => {
        list = Array.from(new Set(list.map(s => s.product_id)))
        .map(product_id => {
            return {
                product_id: product_id,
                seller_id: list.find(s => s.product_id === product_id).seller_id,
                product_name: list.find(s => s.product_id === product_id).product_name,
                info: list.find(s => s.product_id === product_id).info,
                price: list.find(s => s.product_id === product_id).price,
                quantity: list.find(s => s.product_id === product_id).quantity,
                is_deleted: list.find(s => s.product_id === product_id).is_deleted
            }
        })
        return list;
    }

    try {
        const categories = req.body.categories;
        var cat_query = 'select distinct product_id from category where '
        for(var i=0;i<categories.length;i++) {
            cat_query += `tag='${categories[i]['name']}' or `
        }
        cat_query = cat_query.slice(0, cat_query.length - 4);
        var cat_result = await db.query(cat_query)
        console.log(cat_result.rows)
        var range_result = []
        for(var i=0;i<cat_result.rows.length;i++) {
            const r = await db.query(`select * from product where product_id=${cat_result.rows[i]['product_id']} and ${req.body.lower}<=price and price<=${req.body.upper}`);
            range_result.push(r.rows[0])
        }
        const list = unqiue(range_result)
        console.log(list)
        res.json(list);
    }
    catch(err) {
        res.json({'err': err})
    }
})

module.exports = router;