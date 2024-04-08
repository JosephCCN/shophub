var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/categories', async(req, res) =>{
    try{
        result = await db.query(`select * from category_list`);
        res.json(result.rows);
    }
    catch(err){
        res.json({'err': err})
    }
})

router.get('/recommendation', async(req, res) =>{
    const limit = req.query.limit;
    const userid = req.query.userid;

    const shuffle = (item) => {
        for(var i=0;i<Math.sqrt(item.length);i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [item[i], item[j]] = [item[j], item[i]];
        }
        return item;
    }

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
                category: list.find(s => s.product_id === product_id).category,
                is_deleted: list.find(s => s.product_id === product_id).is_deleted
            }
        })
        return list;
    }

    try {
        const result = await db.query(`select product_id, avg(rating) from review group by product_id order by avg desc limit 5`)
        //const result2 = await db.query(`select product.category, count(product.category) from product inner join history on product.product_id=history.product_id where history.buyer_id=${userid} group by product.category order by count desc limit 2`)
        var list = []
        for(var i=0;i<result.rows.length;i++) {
            const r = await db.query(`select * from product where product_id=${result.rows[i]['product_id']} and is_deleted='f'`)
            if(r.rows.length > 0) list.push(r.rows[0]);
        }
        // for(var i=0;i<result2.rows.length;i++) {
        //     const r = await db.query(`select * from product where category='${result2.rows[i]['category']}' and is_deleted='f'`)
        //     if(r.rows.length > 0) list.push(r.rows[0]);
        // }
        list = unqiue(list)
        res.json(shuffle(list).slice(0, limit))
    }
    catch(err) {
        res.json({'err':err});
        return;
    }
})

router.get('/pay', async(req, res) => {
    const userid = req.query.userid;
    try {
        var result = await db.query(`select * from cart where user_id=${userid}`);
        const order_id = await db.query(`select nextval('history_order_id')`);
        var not_enough = []
        for(var i=0;i<result.rows.length;i++) {
            const cur = result.rows[i];
            const r2 = await db.query(`select * from product where product_id=${cur['product_id']} and is_deleted='f'`);
            if(r2.rows.length == 0) continue;
            if(r2.rows[0]['quantity'] < cur['quantity']) {
                not_enough.push(cur['product_id'])
                continue;
            }
            await db.query(`insert into history values (${order_id.rows[0]['nextval']}, ${userid}, ${r2.rows[0]['seller_id']}, ${cur['product_id']}, current_timestamp, ${cur['quantity']}, ${r2.rows[0]['price']})`);
            await db.query(`update product set quantity=${r2.rows[0]['quantity'] - cur['quantity']} where product_id=${cur['product_id']}`);
            await db.query(`delete from cart where user_id=${userid} and product_id=${cur['product_id']}`);
        }
        if(not_enough.length > 0) {
            res.json({'not_enough': not_enough});
            return;
        }
        res.json({'success': 1});
    }
    catch(err) {
        res.json({'err': err})
    }
})

module.exports = router;